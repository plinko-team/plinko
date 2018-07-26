import { World, Engine, Events } from 'matter-js';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game';
import { CANVAS, ROWS, COLS, ROW_SPACING, COL_SPACING, VERTICAL_MARGIN, HORIZONTAL_OFFSET } from '../shared/constants/canvas';
import Chip from '../shared/bodies/Chip';
import Peg from '../shared/bodies/Peg';
import Triangle from '../shared/bodies/Triangle';
import { VerticalWall, HorizontalWall, BucketWall } from '../shared/bodies/Wall';
import EventEmitter from 'eventemitter3';

/**

  TODO: Write description

**/

export default class ServerEngine {
  constructor({ io }) {
    this.knownPlayers = [];
    this.io = io;
    this.engine = Engine.create();
    this.genesisTime = Date.now();
    this.frame = 0;
    this.messages = {
      network: 0,
    };
  }

  log() {
    // const lines = process.stdout.getWindowSize()[1];
    // for(let i = 0; i < lines; i++) {
    //     console.log('\r\n');
    // }

    // console.log("Total bandwidth sent: ", this.messages.network / 1000 , " kb");
  }

  init() {
    this.lastId = 0;
    this.chips = [];
    this.pegs = [];
    this.snapshots = [];
    this.toBeDeleted = {};
    this.createEnvironment();
    this.registerPhysicsEvents();
    this.registerSocketEvents();

    return this;
  }

  incrementScore(chipOwner) {
  }

  decrementScore(formerPegOwner) {
  }

  updateScore = (peg, chip) => {
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
      }

      if (bodyA.label === 'ground') {
        this.toBeDeleted[bodyB.parentObject.id] = true;
        World.remove(this.engine.world, bodyB);
      }
    }
  }

  registerPhysicsEvents() {
    // Collision Events
    Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  }

  registerSocketEvents() {
    let playerId = 1;
    let i = 0;

    this.io.on('connection', socket => {
      this.knownPlayers.push(socket);

      socket.emit('connection established', { playerId: playerId % 4 })
      playerId++;

      // Events must be set on socket established through connection
      socket.on('new chip', (chipInfo) => {
        // Add a new chip to our world
        let chip = new Chip({ id: this.lastId++, ownerId: chipInfo.ownerId, x: chipInfo.x, y: chipInfo.y })
        chip.addToEngine(this.engine.world);
        this.chips.push(chip)
      })

      socket.on('pingMessage', () => {
        socket.emit('pongMessage', { serverTime: Date.now() })
      })

      socket.on('request server frame', () => {
        socket.emit('server frame', { frame: this.frame })
      })
    });
  }

  startGame() {
    this.nextTimestep = Date.now();

    this.loop = setInterval(() => {
      while (Date.now() > this.nextTimestep) {
        this.frame++
        Engine.update(this.engine, TIMESTEP);

        let snapshot = generateSnapshot(this.chips, this.pegs)

        this.messages.network += this.knownPlayers.length * (JSON.stringify(chipInfo) + JSON.stringify(pegInfo)).length

        this.takeSnapshot(snapshot);
        this.broadcastSnapshot(snapshot);

        this.chips = this.chips.filter(chip => {
          return !this.chipsToBeDeleted[chip.id];
        })

        this.chipsToBeDeleted = {};

        this.nextTimestep += TIMESTEP;
      }
    }, 0)
  }

  stopGame() {
    clearInterval(this.loop);
  }

  generateSnapshot(chips, pegs) {
    const chipInfo = chips.map(chip => {
      return {
               id: chip.id,
               ownerId: chip.ownerId,
               x: chip.body.position.x,
               y: chip.body.position.y,
               angle: chip.body.angle,
               velocity: {
                 x: chip.body.velocity.x,
                 y: chip.body.velocity.y,
               },
               angularVelocity: chip.body.angularVelocity
             };
    });

    const pegInfo = pegs.map(peg => {
      return { id: peg.id, ownerId: peg.ownerId };
    });

    return { chips: chipInfo, pegs: pegInfo }
  }

  takeSnapshot({ chips, pegs }) {
    this.snapshots[this.frame] = { chips: chipInfo, pegs: pegInfo }
  }

  broadcastSnapshot({ chips, pegs }) {
    this.knownPlayers.forEach(socket => {
      socket.emit('snapshot', { chips, pegs });
    })
  }

  _createWalls() {
    const leftWall = new VerticalWall({x: 0, y: CANVAS.HEIGHT / 2});
    const rightWall = new VerticalWall({x: CANVAS.WIDTH, y: CANVAS.HEIGHT / 2});
    const ground = new HorizontalWall();

    [leftWall, rightWall, ground].forEach(wall => wall.addToEngine(this.engine.world));
  }


  _createBucketWalls() {
    for (let i = 1; i < COLS; i++) {
      let bucket = new BucketWall({ x: i * COL_SPACING });
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
