import { Engine, Render, Events, World } from 'matter-js';
import Renderer from './renderer';
import Synchronizer from './synchronizer';
import Chip from '../shared/bodies/Chip';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game'
import { PLAYER_COLORS } from '../shared/constants/colors';
import createEnvironment from '../shared/setup';
import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

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
    this.chips = [];
    this.pegs = {};

    createEnvironment(this.stage, this.engine, this.pegs);
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
          World.remove(this.engine.world, bodyA)
          this.env === 'client' && this.stage.removeChild(bodyA.sprite)
        })
      } else if (bodyA.label === 'ground') {
        bodyB.parentObject.shrink(() => {
          World.remove(this.engine.world, bodyB)
          this.env === 'client' && this.stage.removeChild(bodyB.sprite)
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

      this.socket.on('new chip', this.onNewChip.bind(this));
      this.socket.on('genesis time', ({ genesisTime }) => {
        this.genesisTime = genesisTime;
      })
    })
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

  startGame() {
    this.synchronizer.startSyncing();

    this.timeStarted = Date.now();
    this.nextTimestep = Date.now();
    let endX;
    let endY;
    let startX;
    let startY;

    this.loop = setInterval(() => {
      while (Date.now() > this.nextTimestep) {

        Engine.update(this.engine, TIMESTEP);
        this.nextTimestep += TIMESTEP;

      }

      let interpolation = (Date.now() + TIMESTEP - this.nextTimestep)
                        / TIMESTEP;

      this.env === 'client' && this.chips.forEach(chip => {
        chip.sprite.destination = chip.body.position;
        chip.sprite.begin = chip.sprite.position;
        let incrementX = chip.sprite.destination.x - chip.sprite.begin.x;
        let incrementY = chip.sprite.destination.y - chip.sprite.begin.y;

        chip.sprite.position.x += incrementX * interpolation;
        chip.sprite.position.y += incrementY * interpolation;
        chip.sprite.rotation = chip.body.angle;
      })

      this.env === 'client' && this.renderer.render(this.stage);
    }, 0)
  }

  stopGame() {
    clearInterval(this.loop);
  }

  onNewChip(chipInfo) {
    const chip = new Chip(chipInfo);

    chip.addToEngine(this.engine.world);
    chip.addToRenderer(this.stage);
    this.chips.push(chip);
    this.renderer.render(this.stage);
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation()

    // Short circuit handler if outside of drop boundary
    if (e.offsetY > DROP_BOUNDARY) { return }

    const x = e.offsetX;
    const y = e.offsetY;

    this.socket.emit('new chip', { x, y, ownerId: window.playerId })
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
    const leftWall = new VerticalWall({x: 0, y: CANVAS_HEIGHT / 2});
    const rightWall = new VerticalWall({x: CANVAS_WIDTH, y: CANVAS_HEIGHT / 2});
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

      if (typeof window === 'object') { bucket.addToRenderer(this.stage) }
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
      if (typeof window === 'object') { t.addToRenderer(this.stage) }
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

        let peg = new Peg({ id, x, y });
        this.pegs[id] = peg;
        peg.addToEngine(this.engine.world);
        if (peg.sprite) { peg.addToRenderer(this.stage) };

        id++;
      }
    }
  }

  createEnvironment() {
    _createWalls();
    _createBucketWalls();
    _createPegs();
    _createTriangles();
  }
}
