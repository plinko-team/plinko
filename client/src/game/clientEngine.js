import EventEmitter from 'eventemitter3';

import Serializer from '../shared/serializer';
import Synchronizer from './synchronizer';
import Renderer from './renderer';
import Chip from './bodies/Chip';
import Peg from './bodies/Peg';
import Triangle from './bodies/Triangle';
import HoverChip from './bodies/HoverChip';
import { VerticalWall, HorizontalWall, BucketWall } from './bodies/Wall';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game'
import { Snapshot, SnapshotBuffer } from './snapshot.js';
import { Body, Engine, Render, Events, World } from 'matter-js';

import {
  NEW_CHIP,
  SNAPSHOT,
  // INITIATE_SYNC,
  HANDSHAKE_COMPLETE,
  SERVER_FRAME,
  // REQUEST_SERVER_FRAME
} from '../shared/constants/events'

import {
  CANVAS,
  ROWS,
  COLS,
  ROW_SPACING,
  COL_SPACING,
  VERTICAL_MARGIN,
  HORIZONTAL_OFFSET
} from '../shared/constants/canvas'

/**

  ClientEngine holds all of the logic for running the game loop, rendering
  the objects to the canvas, connecting to the server through websockets. Also
  generates the world and binds events.

**/

export default class ClientEngine {
  constructor({ playerId, socket, latency }) {
    this.playerId = playerId;
    this.socket = socket;
    this.engine = Engine.create();
    this.engine.world.gravity.y = 0.35;

    this.renderer = new Renderer();
    this.eventEmitter = new EventEmitter();
    // this.synchronizer = new Synchronizer(this.socket, this.eventEmitter).init();
    this.snapshotBuffer = new SnapshotBuffer();
    this.latency = latency

  }

  init() {
    this.awaitingFrame = true;
    this.frame = 0;
    this.deletedChips = {};
    this.chips = {};
    this.pegs = {};
    this.isRunning = false;
    this.lastChipId = 0;

    this.createEnvironment();
    this.registerCanvasEvents();
    this.registerSocketEvents();
    this.registerPhysicsEvents();

    return this;
  }

  // establishSynchronization() {
  //   this.synchronizer.handshake();
  //
  //   this.eventEmitter.once(HANDSHAKE_COMPLETE, () => {
  //     console.log("Handshake complete, your latency is: ", this.synchronizer.latency)
  //   })
  // }

  onCollisionStart = (event) => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;
      //
      // if (bodyA.label === 'peg' && bodyB.label === 'chip' && !this.winner) {
      //   this.updateScore(bodyA, bodyB);
      // }

      if (bodyA.label === 'peg') {
        bodyA.parentObject.ownerId = bodyB.parentObject.ownerId;
      }

      if (bodyA.label === 'ground') {
        const chip = bodyB.parentObject;
        const combinedId = String(chip.ownerId) + String(chip.id);

        this.deletedChips[combinedId] = true;

        World.remove(this.engine.world, chip.body);
        this.renderer.removeFromStage(chip);
        delete this.chips[combinedId];
      }
    }
  }

  registerPhysicsEvents() {
    Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  }

  unregisterSocketEvents() {
    this.socket.off('game started');
    this.socket.off(SNAPSHOT);
  }

  registerSocketEvents() {
    this.socket.on('game started', ({ frame }) => {
      this.frame = frame + Math.ceil(this.latency / TIMESTEP);
    });

    this.socket.on(SNAPSHOT, ({ frame, chips, pegs, score, winner, targetScore }) => {
      // let { chips, pegs, score, winner, targetScore } = Serializer.decode(encodedSnapshot);
      let estimatedServerFrame = frame + Math.ceil(this.latency / TIMESTEP);

      this.nextWholeFrame = estimatedServerFrame

      if (Math.abs(estimatedServerFrame - this.frame) > 3) {
        this.awaitingFrame = true;
      }

      if (this.isRunning) {
        // this.snapshotBuffer.push(new Snapshot({ frame, pegs, chips, score, winner, targetScore, timestamp: performance.now() }));
        this.latestSnapshot = new Snapshot({ frame, pegs, chips, score, winner, targetScore, timestamp: performance.now() })
      }
    });
  }

  registerCanvasEvents() {
    // On click, add a chip at the mouse's x and y relative to canvas
    document.querySelector('canvas').addEventListener('click', this.onClick, false);
    // We prevent the default mousedown event so that when you spam chips,
    // random parts of the DOM might get highlighted due to double click
    document.body.addEventListener('mousedown', (e) => { e.preventDefault() });
    // When the client moves the mouse, display a chip overlay
    document.querySelector('canvas').addEventListener('mouseenter', this.onMouseEnter);
  }

  frameSync() {
    let startTime = performance.now();

    const currentSnapshot = this.latestSnapshot;
    delete this.latestSnapshot;

    currentSnapshot.chips.forEach(chipInfo => {
      let { id, ownerId, x, y, angle, velocity, angularVelocity } = chipInfo;
      let combinedId = String(ownerId) + String(id)

      if (!!this.deletedChips[combinedId]) {
        return;
      }

      if (typeof this.chips[combinedId] === 'undefined') {
        const chip = new Chip({ id, ownerId, x, y });

        chip.addToEngine(this.engine.world);
        chip.registerUpdateListener(this.engine);
        this.renderer.addToStage(chip);

        this.chips[combinedId] = chip;
      }

      const chip = this.chips[combinedId];
      const body = chip.body;

      //// Turn this on for bending behaviour
      // chip.bendingCount = 3; // Counts down to 0

      Body.setPosition(body, { x, y });
      Body.setAngle(body, angle);
      Body.setVelocity(body, velocity);
      Body.setAngularVelocity(body, angularVelocity);
    })

    let frame = currentSnapshot.frame;

    this.engine.reenactment = true;
    // Catch up to current frame from snapshot
    while (frame <= this.frame) {
      // console.log("Catching up!")
      frame++;
      Engine.update(this.engine, TIMESTEP);
    }

    this.engine.reenactment = false;

    // console.log("Reenactment took: ", performance.now() - startTime)
  }

  update() {
    Engine.update(this.engine, TIMESTEP);
  }

  animate(timestamp) {
    let start = performance.now()
    // Schedule for next rAF and return
    // if not enough time passed for engine update

    if (timestamp < this.lastFrameTime + TIMESTEP) {
      this.frameID = requestAnimationFrame(this.animate.bind(this));
      return;
    }

    // Set frame to estimatedServerFrame that we got from the latest snapshot
    if (typeof this.nextWholeFrame !== 'undefined' && this.awaitingFrame) {
      console.log("Adjusted")
      this.frame = this.nextWholeFrame;
      this.nextWholeFrame = undefined;
      this.awaitingFrame = false;
    }

    this.delta += timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    while (this.delta >= TIMESTEP) {
      // Step engine forward or process snapshot
      !!this.latestSnapshot ? this.frameSync() : this.update();
      this.frame++
      console.log(this.frame);
      this.delta -= TIMESTEP;
    }

    // this.renderer.spriteUpdate(this.chips);

    this.renderer.render(this.chips);

    this.frameID = requestAnimationFrame(this.animate.bind(this));

    if (performance.now() - start > 30) {
      console.log("Game loop took: ", performance.now() - start)
    }
  }

  startGame() {
    // Entry point for updates and rendering; Only gets called once
    this.isRunning = true;

    requestAnimationFrame(timestamp => {
      this.lastSyncTime = timestamp;
      this.renderer.render();
      this.lastFrameTime = timestamp;
      this.delta = 0;
      requestAnimationFrame(this.animate.bind(this));
    })
  }

  stopGame() {
    this.isRunning = false;
    clearInterval(this.frameID);
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isRunning) { return }

    // Short circuit handler if outside of drop boundary
    // if (e.offsetY > DROP_BOUNDARY) { return }

    const x = e.offsetX;
    const y = e.offsetY;
    const ownerId = this.playerId;
    const id = this.lastChipId++ % 255;

    let frame = this.frame;

    let chip = new Chip({ id, ownerId, x, y });
    chip.recentlyDropped = true;
    this.renderer.addToStage(chip);
    chip.addToEngine(this.engine.world);
    chip.registerUpdateListener(this.engine);

    this.chips[String(ownerId) + String(id)] = chip;
    this.socket.emit(NEW_CHIP, { frame, id, x, y, ownerId });
  }

  onMouseEnter = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const hoverChip = new HoverChip({ x, y, ownerId: this.playerId });
    this.renderer.addToStage(hoverChip);

    e.target.addEventListener('mouseleave', () => {
      this.renderer.removeFromStage(hoverChip);
    });
  }

  updateTargetScore(targetScore) {
    document.body.querySelector('.peg-target').innerText = targetScore;
  }

  highlightWinner(scores) {
    let winnerId;
    let playerElement;
    let highScore = 0;

    let infoContainer = document.querySelector('.game-info');
    let winnerBanner = document.createElement('div');

    Object.values(scores)
      .map(score => parseInt(score, 10))
      .forEach((score, id) => {
        if (score > highScore) {
          highScore = score;
          winnerId = id;
        }
    });

    winnerBanner.setAttribute('id', 'winner-element');
    winnerBanner.textContent = `Winner is player ${winnerId + 1}`;
    infoContainer.appendChild(winnerBanner);

    playerElement = '.player-' + winnerId;
    document.body.querySelector(playerElement).style.color = 'yellow';
  }

  updateScoreboard(score) {
    for (let i = 0; i <= 3; i++) {
      let scoreElement = '.player-' + i;
      document.body.querySelector(scoreElement).children[0].innerHTML = score[i];
    }
  }

  _createWalls(stage, engine) {
    const leftWall = new VerticalWall({x: 0, y: 0});
    const rightWall = new VerticalWall({x: CANVAS.WIDTH - 2, y: 0});
    const ground = new HorizontalWall();
    const walls = [leftWall, rightWall, ground];

    walls.forEach(w => {
      w.addToEngine(this.engine.world);
      this.renderer.addToStage(w);
    });

    // const ground = new HorizontalWall();
    // this.renderer.addToStage(ground);
  }

  _createBucketWalls() {
    for (let i = 1; i < COLS; i++) {
      let bucket = new BucketWall({ x: i * COL_SPACING });

      bucket.addToEngine(this.engine.world);
      this.renderer.addToStage(bucket);
    }
  }

  _createTriangles() {
    const triangles = [
      {y: 91, side: 'right'},
      {y: 223, side: 'right'},
      {y: 355, side: 'right'},
      {y: 91, side: 'left'},
      {y: 223, side: 'left'},
      {y: 355, side: 'left'},
    ];

    triangles.forEach(triangle => {
      let t = new Triangle(triangle);
      t.addToEngine(this.engine.world);
      this.renderer.addToStage(t);
    });
  }

  _createPegs() {
    let id = 0;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 1; col < COLS; col++) {
        let x = col * COL_SPACING;
        // leave extra space at top of frame to drop chips
        let y = VERTICAL_MARGIN + (row * ROW_SPACING);

        if (row % 2 === 1 && col === COLS - 1) {
          // skip last peg on odd rows
          break;
        } else if (row % 2 === 1) {
          // offset columns in odd rows by half
          x += HORIZONTAL_OFFSET;
        }

        const peg = new Peg({ id, x, y });
        this.pegs[id] = peg;
        id++;

        peg.addToEngine(this.engine.world);
        this.renderer.addToStage(peg);
      }
    }
  }

  createEnvironment() {
    this._createWalls();
    this._createBucketWalls();
    this._createPegs();
    this._createTriangles();
  }
}
