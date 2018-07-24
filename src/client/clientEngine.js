import { Engine, Render, Events, World } from 'matter-js';
import Renderer from './renderer';
import Synchronizer from './synchronizer';
import Chip from '../shared/bodies/Chip';
import Peg from '../shared/bodies/Peg';
import Triangle from '../shared/bodies/Triangle';
import { VerticalWall, HorizontalWall, BucketWall } from '../shared/bodies/Wall';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game'
import { PLAYER_COLORS } from '../shared/constants/colors';
import { CANVAS, ROWS, ROW_SPACING, COLS, COL_SPACING, VERTICAL_MARGIN, HORIZONTAL_OFFSET } from '../shared/constants/canvas'
import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';
import { Snapshot, SnapshotBuffer } from './snapshot.js'

/**

  ClientEngine holds all of the logic for running the game loop, rendering
  the objects to the canvas, connecting to the server through websockets. Also
  generates the world and binds events.

**/

export default class ClientEngine {
  constructor({ url }) {
    this.env = 'client';
    this.socket = io.connect(url);
    this.renderer = new Renderer();
    this.stage = this.renderer.stage;
    this.engine = Engine.create();
    this.eventEmitter = new EventEmitter();
    this.synchronizer = new Synchronizer(this.socket, this.eventEmitter);
    console.log("Connecting to...", url)
  }

  init() {
    this.chips = {};
    this.pegs = {};
    this.newSnapshot = false;
    this.snapshotBuffer = new SnapshotBuffer();

    this.createEnvironment();
    this.registerPhysicsEvents();
    this.registerCanvasEvents();
    this.registerSocketEvents();

    return this;
  }

  establishGenesisTime() {
    this.synchronizer.handshake();

    this.eventEmitter.once('handshake complete', () => {
      socket.emit('request genesis time');
    })
  }

  incrementScore(chipOwner) {
    const ownerScoreElement = '.player-' + chipOwner;
    const chipOwnerScore  = +document.body.querySelector(ownerScoreElement).children[0].innerHTML;
    const score = chipOwnerScore + 1;
    document.body.querySelector(ownerScoreElement).children[0].innerHTML = score;
  }

  decrementScore(formerPegOwner) {
    const formerPegOwnerElement = '.player-' + formerPegOwner;
    const formerPegOwnerScore  = +document.body.querySelector(formerPegOwnerElement).children[0].innerHTML;
    const score = formerPegOwnerScore - 1;
    document.body.querySelector(formerPegOwnerElement).children[0].innerHTML = score;
  }

  updateScore = (peg, chip) => {
    // Assuming pegs are always the bodyA and chips are always the bodyB (Matter.js implementation)
    const formerPegOwner = peg.parentObject.ownerId;
    const chipOwner = chip.parentObject.ownerId;

    if (chipOwner !== formerPegOwner) {
      this.incrementScore(chipOwner);

      // Pegs initialize with owner set to null
      if (formerPegOwner) { this.decrementScore(formerPegOwner); }
    }
  }

  onCollisionStart = (event) => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.label === 'peg' && bodyB.label === 'chip') {
        this.updateScore(bodyA, bodyB);
      }

      if (bodyA.label === 'peg') {
        bodyA.parentObject.ownerId = bodyB.parentObject.ownerId;
        bodyA.sprite.tint = PLAYER_COLORS[bodyA.parentObject.ownerId];
      }
      if (bodyB.label === 'peg') {
        bodyB.parentObject.ownerId = bodyA.parentObject.ownerId;
        bodyB.sprite.tint = PLAYER_COLORS[bodyB.parentObject.ownerId];
      }

      if (bodyB.label === 'ground') {
        bodyA.parentObject.shrink(() => {
          World.remove(this.engine.world, bodyA);
          this.env === 'client' && this.stage.removeChild(bodyA.sprite);
        })
      } else if (bodyA.label === 'ground') {
        bodyB.parentObject.shrink(() => {
          World.remove(this.engine.world, bodyB);
          this.env === 'client' && this.stage.removeChild(bodyB.sprite);
        })
      }
    }
  }

  registerPhysicsEvents() {
    // Collision Events
    Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  }

  registerSocketEvents() {
    this.socket.on('connection established', ({ playerId }) => {
      console.log('ESTABLISHED! Your player ID is: ', playerId);
      window.playerId = playerId;
    })

    this.socket.on('genesis time', ({ genesisTime }) => {
      this.genesisTime = genesisTime;
    })

    this.socket.on('snapshot', ({ pegs, chips }) => {
      this.snapshotBuffer.push(new Snapshot({ pegs, chips, timestamp: performance.now() }));
    });
  }

  registerCanvasEvents() {
    // On click, add a chip at the mouse's x and y relative to canvas
    document.querySelector('canvas').addEventListener('click', this.onClick, false);
    // We prevent the default mousedown event so that when you spam chips,
    // random parts of the DOM might get highlighted due to double click
    document.body.addEventListener('mousedown', (e) => { e.preventDefault() })
    // When the client moves the mouse, display a chip overlay
    document.querySelector('canvas').addEventListener('mouseenter', this.onMouseEnter)
  }

  update() {
    // console.log("Snapshot buffer length: ", this.snapshotBuffer.length)
    let firstSnapshot = this.snapshotBuffer.first
    if (firstSnapshot && performance.now() - firstSnapshot.timestamp > TIMESTEP * 2) {
      let snapshot = this.snapshotBuffer.shift()

      // Update the bodies based on the snapshot
      let newChips = snapshot.chips;

      newChips.forEach(newChip => {
        let { id, x, y, angle, ownerId } = newChip;

        let chip = this.chips[id];

        if (!chip) {
          chip = new Chip({ id, ownerId, x, y });
          chip.addToEngine(this.engine.world);
          chip.addToRenderer(this.stage);
          this.chips[id] = chip;
        }

        chip.lastX = chip.body.position.x;
        chip.lastY = chip.body.position.y;
        chip.lastAngle = chip.body.angle;

        chip.nextX = x;
        chip.nextY = y;
        chip.nextAngle = angle;
      })
    }
  }

  animate(timestamp) {
    if (timestamp < this.lastFrameTime + TIMESTEP) {
      this.frameID = requestAnimationFrame(this.animate.bind(this));
      return;
    }

    this.delta += timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    while (this.delta >= TIMESTEP) {
      this.update();
      this.delta -= TIMESTEP;
    }

    if (!!this.chips[0]) {
      let logX = this.chips[0].body.position.x.toFixed(2);
      let logY = this.chips[0].body.position.y.toFixed(2);
      console.log(logX, logY)
    }
    this.renderer.interpolate(this.chips, 1);
    this.renderer.render(this.stage);

    this.frameID = requestAnimationFrame(this.animate.bind(this));
  }

  startGame() {
    requestAnimationFrame((timestamp) => {
      this.renderer.render(this.stage);
      this.lastFrameTime = timestamp;
      this.delta = 0;
      requestAnimationFrame(this.animate.bind(this));
    })
  }

  //
  // oldAnimate(timestamp) {
  //   this.lastTimestamp = timestamp;
  //   this.nextTimestep = this.nextTimestep || timestamp;
  //
  //   if (timestamp > this.nextTimestep) {
  //
  //     if (this.snapshotBuffer.length > 0) {
  //       let snapshot = this.snapshotBuffer.shift();
  //
  //       // Update the bodies based on the snapshot
  //       let newChips = snapshot.chips;
  //
  //       newChips.forEach(newChip => {
  //         let { id, x, y, angle, ownerId} = newChip;
  //
  //         let chip = this.chips[id];
  //
  //         if (!chip) {
  //           chip = new Chip({ id, ownerId, x, y });
  //           chip.addToEngine(this.engine.world);
  //           chip.addToRenderer(this.stage);
  //           this.chips[id] = chip;
  //         }
  //
  //         chip.lastX = chip.body.position.x;
  //         chip.lastY = chip.body.position.y;
  //         chip.lastAngle = chip.body.angle;
  //
  //         chip.nextX = x;
  //         chip.nextY = y;
  //         chip.nextAngle = angle;
  //       })
  //     }
  //
  //     this.nextTimestep += TIMESTEP;
  //   }
  //
  //   // console.log(`Numerator:  ${Date.now() - this.lastTimestep}`)
  //   // console.log(`Denominator: ${this.nextTimestep - this.lastTimestep}`)
  //
  //   // let interpolation = (Date.now() - this.lastTimestep) / (this.nextTimestep - this.lastTimestep)
  //   // console.log(interpolation)
  //   // console.log(`${Date.now() - l}, ${this.nextTimestep - l}, ${this.lastTimestep - l}`)
  //
  //   this.renderer.interpolate(this.chips, 1);
  //   this.renderer.render(this.stage);
  //   requestAnimationFrame(this.animate.bind(this));
  // }
  //
  // oldStartGame() {
  //   requestAnimationFrame(this.animate.bind(this));
  // }

  stopGame() {
    clearInterval(this.loop);
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Short circuit handler if outside of drop boundary
    if (e.offsetY > DROP_BOUNDARY) { return }

    const x = e.offsetX;
    const y = e.offsetY;

    this.socket.emit('new chip', { x, y, ownerId: window.playerId });
  }

  onMouseEnter = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const hoverChip = new HoverChip({ x, y, ownerId: window.playerId });
    hoverChip.addToRenderer(this.stage);

    e.target.addEventListener('mouseleave', () => {
      hoverChip.removeChip(this.stage);
    });
  }

  _createWalls(stage, engine) {
    const leftWall = new VerticalWall({x: 0, y: CANVAS.HEIGHT / 2});
    const rightWall = new VerticalWall({x: CANVAS.WIDTH, y: CANVAS.HEIGHT / 2});
    const ground = new HorizontalWall();
    const walls = [leftWall, rightWall, ground];

    if (typeof window === 'object') {
      walls.forEach(wall => wall.addToRenderer(this.stage));
    }

    walls.forEach(wall => wall.addToEngine(this.engine.world));
  }


  _createBucketWalls() {
    for (let i = 1; i < COLS; i++) {
      let bucket = new BucketWall({ x: i * COL_SPACING });

      if (typeof window === 'object') { bucket.addToRenderer(this.stage) };
      bucket.addToEngine(this.engine.world);
    }
  }

  _createTriangles() {
    // Positional calculations and vertices for the wall triangles.
    let triangles = [
                {x: 772, y: 290, side: 'right'},
                {x: 772, y: 158, vertices: '50 150 15 75 50 0', side: 'right'},
                {x: 772, y: 422, vertices: '50 150 15 75 50 0', side: 'right'},
                {x: 28, y: 305,  vertices: '50 150 85 75 50 0', side: 'left'},
                {x: 28, y: 173,  vertices: '50 150 85 75 50 0', side: 'left'},
                {x: 28, y: 437,  vertices: '50 150 85 75 50 0', side: 'left'},
              ];

    triangles.forEach(triangle => {
      let t = new Triangle(triangle);
      t.addToEngine(this.engine.world);
      if (typeof window === 'object') { t.addToRenderer(this.stage) };
    });
  }

  _createPegs() {
    const verticalOffset = ROW_SPACING / 2;
    const horizontalOffset = COL_SPACING / 2;

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
        if (id === 0) {
          console.log(`Peg Coords: ${x}, ${y}`)
        }
        let peg = new Peg({ id, x, y });
        this.pegs[id] = peg;
        peg.addToEngine(this.engine.world);
        if (peg.sprite) { peg.addToRenderer(this.stage) };

        id++;
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
