import EventEmitter from 'eventemitter3';
import { Body, World, Engine, Events } from 'matter-js';

import Chip from '../bodies/Chip';
import Peg from '../bodies/Peg';
import Triangle from '../bodies/Triangle';
import { VerticalWall, HorizontalWall, BucketWall } from '../bodies/Wall';
import { DROP_BOUNDARY, TIMESTEP, TARGET_SCORE } from '../shared/constants/game';
import { Input, InputBuffer } from './inputBuffer';
import InputHistory from './inputHistory';

// import Serializer from '../shared/serializer';
import User from './user';
import UserCollection from './userCollection';
import WaitingQueue from './waitingQueue';
import SnapshotHistory from './snapshotHistory'


import { CANVAS,
         ROWS,
         COLS,
         ROW_SPACING,
         COL_SPACING,
         VERTICAL_MARGIN,
         HORIZONTAL_OFFSET } from '../shared/constants/canvas'

import { CONNECTION,
         CONNECTION_ESTABLISHED,
         NEW_CHIP,
         PING_MESSAGE,
         PONG_MESSAGE,
         SERVER_FRAME,
         REQUEST_SERVER_FRAME,
         SNAPSHOT,
         INITIATE_SYNC,
         HANDSHAKE_COMPLETE } from '../shared/constants/events'

/**

  TODO: Write description

**/

export default class ServerEngine {
  constructor({ io }) {
    this.users = new UserCollection();
    this.activeUsers = new UserCollection();
    this.snapshotHistory = new SnapshotHistory();
    this.io = io;
    this.engine = Engine.create();
    this.engine.world.gravity.y = 1;
    this.frame = 0;
    this.inputBuffer = new InputBuffer();
    this.inputHistory = new InputHistory();
    this.waitingQueue = new WaitingQueue();
    this.gameIsRunning = false;
    this.gameLoop = undefined;
    this.playerIds = {0: null, 1: null, 2: null, 3: null};

    console.log('new ServerEngine! gameIsRunning:', this.gameIsRunning)
  }

  init() {
    this.chipsToBeDeleted = {}
    this.logged = false
    this.chips = {};
    this.pegs = [];
    this.winner = false;
    this.initializeScore();
    this.createEnvironment();
    this.registerPhysicsEvents();
    this.registerSocketEvents();

    return this;
  }

  now() {
    // High resolution time

    const time = process.hrtime()
    const seconds = time[0];
    const microseconds = time[1]

    return seconds * 1000 + microseconds / 1000000
  }

  initializeScore() {
    this.targetScore = TARGET_SCORE;
    this.targetScoreInterval = false;
    this.score = { 0: 0, 1: 0, 2: 0, 3: 0 };
  }

  incrementScore(chipOwner) {
    this.score[chipOwner] += 1;
  }

  decrementScore(formerPegOwner) {
    this.score[formerPegOwner] -= 1;
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

      if (bodyA.label === 'peg' && bodyB.label === 'chip' && !this.winner) {
        this.updateScore(bodyA, bodyB);
      }

      if (bodyA.label === 'peg') {
        bodyA.parentObject.ownerId = bodyB.parentObject.ownerId;
      }

      if (bodyA.label === 'ground') {
        const chip = bodyB.parentObject;
        const combinedId = String(chip.ownerId) + String(chip.id);

        this.chipsToBeDeleted[combinedId] = chip;

        World.remove(this.engine.world, chip.body);
        delete this.chips[combinedId];
      }

      // if (bodyA.label === 'ground') {
      //   const chip = bodyB.parentObject;
      //   const combinedId = String(chip.ownerId) + String(chip.id);
      //
      //   chip.shrink(() => {
      //     World.remove(this.engine.world, chip.body);
      //     delete this.chips[combinedId];
      //   })
      // }
    }
  }

  registerPhysicsEvents() {
    // Collision Events
    Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  }

  fillActiveUsers() {
    while (this.waitingQueue.length > 0 && this.activeUsers.length < 4) {
      let user = this.waitingQueue.dequeue();

      console.log("Queuing player: ", user.userId, " playerId: ", user.playerId)

      if (this.users.get(user.userId)) {
        let playerId;

        for (let id in this.playerIds) {
          if (!this.playerIds[id]) {
            user.playerId = id;
            this.playerIds[id] = user.userId;
            break;
          }
        }

        this.activeUsers.add(user);
        user.setActive();
      }
    }
  }

  registerSocketEvents() {
    this.io.on(CONNECTION, socket => {
      let user;

      socket.emit(CONNECTION_ESTABLISHED, { message: 'congratulations' });

      socket.on('new user', ({ name }) => {
        user = new User({ socket });
        user.name = name;
        this.users.add(user);

        socket.emit('new user ack', {
          userId: user.userId,
          gameInProgress: this.gameIsRunning
        });

        this.waitingQueue.enqueue(user);

        console.log('new user! gameIsRunning:', this.gameIsRunning)

        if (!this.gameIsRunning) {
          this.fillActiveUsers();
        }

        this.broadcastUserList();
      });

      // Events must be set on socket established through connection
      socket.on(NEW_CHIP, (chipInfo) => {
        // console.log(`New chip from client: frame ${chipInfo.frame} on server frame ${this.frame}`)

        // In case client somehow thinks it's ahead of the server
        // if (chipInfo.frame > this.frame) {
        //   chipInfo.frame = this.frame
        // }

        this.inputBuffer.insert(new Input(chipInfo));
      });

      socket.on(PING_MESSAGE, () => {
        socket.emit(PONG_MESSAGE, { serverTime: Date.now() });
      });

      socket.on(REQUEST_SERVER_FRAME, () => {
        socket.emit(SERVER_FRAME, { frame: this.frame });
      });

      socket.on('start game', () => {
        this.frame = 0;
        this.activeUsers.broadcastAll('start game');
        this.users.broadcastAll('game started');
        setTimeout(this.startGame.bind(this), 5000);
      });

      socket.on('leave game', () => {
        if (user) {
          console.log('received leave game for userID', user.userId)
          this.removeFromGame(user);
        }
      });

      // should be called when users refresh or navigate away from site,
      // but we are not currently emitting an explicit disconnect
      socket.on('disconnect', () => {
        this.removeFromGame(user);
        this.users.delete(user);

        user = undefined;
      });

      socket.on('rejoin game', ({ userId }) => {
        console.log('received rejoin game for userId', userId)
        user = this.users.get(userId);

        this.activeUsers.delete(user);
        this.waitingQueue.enqueue(user);

        if (!this.gameIsRunning) {
          console.log("Filling active users from rejoin game")
          this.fillActiveUsers();
        }

        socket.emit('rejoin game ack', { gameInProgress: this.gameIsRunning })

        this.broadcastUserList();
      });
    });
  }

  removeFromGame(user) {
    this.activeUsers.delete(user);
    this.playerIds[user.playerId] = null;

    if (this.gameIsRunning && this.activeUsers.length === 0) {
      this.stopGame();
    } else {
      this.fillActiveUsers();
    }

    this.broadcastUserList();
  }

  broadcastUserList() {
    let activeUsers = {};
    let waitingUsers = {};
    let playerId;

    this.activeUsers.forEach(user => {
      activeUsers[user.userId] = {
        name: user.name,
        playerId: user.playerId,
      }
    });

    this.waitingQueue.forEach(user => {
      waitingUsers[user.userId] = {
        name: user.name,
      }
    });

    this.users.forEach((user) => {
      if (user.status === 'waiting' || user.status === 'active') {
        user.socket.emit('user list', ({ activeUsers, waitingUsers }));
      }
    })

    console.log("Active: ", activeUsers, "\nWaiting: ",  waitingUsers)
  }

  processInputs() {
    let frame = this.inputBuffer.first.frame;

    while (!this.inputBuffer.isEmpty()) {
      let input = this.inputBuffer.shift()

      this.inputHistory.insert(input)
    }

    let snapshot = this.snapshotHistory.at(frame)
    console.log(`Snapshot frame: ${frame}, Current frame: ${this.frame}`)

    this.restoreWorldFromSnapshot(snapshot);
    this.catchUpToCurrentFrameFrom(frame);
  }

  gameIsOver() {
    const scores = Object.values(this.score);
    const scoresAboveZero = scores.some(score => score > 0);
    const winningPlayer = scores.some(score => score >= this.targetScore);

    return (this.targetScore === 0 && !scoresAboveZero) || winningPlayer;
  }

  reduceTargetScoreInterval() {
    this.targetScoreInterval = setInterval(() => {
      this.targetScore -= 1;
    }, 1000);
  }

  catchUpToCurrentFrameFrom(frame) {
    let start = this.now();
    let reenactmentCount = 0;

    while (frame < this.frame) {
      reenactmentCount++;

      const inputs = this.inputHistory.inputsAt(frame)

      if (inputs) {
        inputs.forEach(chipInfo => {
          let chip = new Chip({ id: chipInfo.id, ownerId: chipInfo.ownerId, x: chipInfo.x, y: chipInfo.y })
          chip.addToEngine(this.engine.world);

          let combinedId = String(chipInfo.ownerId) + String(chipInfo.id)
          this.chips[combinedId] = chip;
        })
      }

      let generatedSnapshot = this.generateSnapshot(this.chips, this.pegs, this.score,
                                           this.winner, this.targetScore);

      this.snapshotHistory.update(frame, generatedSnapshot);

      Engine.update(this.engine, TIMESTEP);

      frame++;
    }

    console.log("# Reenactment steps: ", reenactmentCount)

    // console.log("Catch up took: ", this.now() - start, " ms")
  }

  restoreWorldFromSnapshot(snapshot) {
    // Note: `snapshot` parameter is supplied from processInputs()

    // Extract out chips and pegs from our snapshot
    const chips = snapshot.chips;
    const pegs = snapshot.pegs;
    const chipsThatExistAtSnapshot = [];

    // Iterate over all chips in snapshot
    chips.forEach(chipInfo => {
      // Pull out all relevant properties from chip
      const { id, ownerId, x, y, angle, velocity, angularVelocity } = chipInfo;

      let combinedId = String(ownerId) + String(id);
      chipsThatExistAtSnapshot.push(combinedId);

      // If chip exists in snapshot but not in our currently world
      // We need to create and add it to the world
      if (typeof this.chips[combinedId] === 'undefined') {
        const chip = new Chip({ id, ownerId, x, y });
        chip.addToEngine(this.engine.world);
        this.chips[combinedId] = chip;
      }

      const chip = this.chips[combinedId];
      const body = chip.body;

      // Update properties for chip in actual world

      Body.setPosition(body, { x, y });
      Body.setAngle(body, angle);
      Body.setVelocity(body, velocity);
      Body.setAngularVelocity(body, angularVelocity);
    });

    // Because we are going "back in time", the world may currently contain chips
    // which are not present in a past snapshot. We must do an operation to
    // remove these from the world
    let chipsThatExist = {};

    chipsThatExistAtSnapshot.forEach(combinedId => {
      chipsThatExist[combinedId] = this.chips[combinedId];
    });

    this.chips = chipsThatExist;
  }

  processChipsToBeDeleted() {
    Object.keys(this.chipsToBeDeleted).forEach((combinedId) => {
      delete this.chips[combinedId];
      delete this.chipsToBeDeleted[combinedId]
    });

    this.chipsToBeDeleted = {};
  }

  animate() {
    if (this.now() - this.gameStartedAt >= 1000) {
      this.gameStartedAt = this.now()
      this.frameCounter = 0;
    }

    let start = this.now();

    if (this.now() < this.lastFrameTime + TIMESTEP) {
      this.gameLoop = setImmediate(this.animate.bind(this));
      return;
    }

    // Schedule next animate
    this.gameLoop = setImmediate(this.animate.bind(this))

    while (this.now() > this.nextTimestep) {
      this.processChipsToBeDeleted();
      this.frameCounter++

      // If input buffer is empty, update like normal
      // If there are inputs, reenact steps from first input in buffer

      this.inputBuffer.isEmpty() ? this.update() : this.processInputs();
    }

    // For benchmarking
    if (this.now() - start > 33) {
      console.log("!! Entire game loop took: ", this.now() - start, " ms")
    }
  }

  startGame() {
    this.gameStartedAt = this.now();
    this.frameCounter = 0;
    this.gameIsRunning = true;
    this.nextTimestep = this.now(); // initialize nextTimestep which get
                                    // incremented in update()

    this.gameLoop = setImmediate(this.animate.bind(this))
  }

  update() {
    let start = this.now();

    this.frame++;
    Engine.update(this.engine, TIMESTEP);

    // Deal with score and win conditions
    if (!this.targetScoreInterval) { this.reduceTargetScoreInterval() }

    if (!this.winner && this.gameIsOver()) {
      this.winner = true;
      clearInterval(this.targetScoreInterval);
      this.endRound();
    }

    let snapshot = this.generateSnapshot(this.chips, this.pegs, this.score,
                                         this.winner, this.targetScore);

    this.takeSnapshot(snapshot);

    let fps = 30;
    let broadcastRate = 10

    if (this.frame % (fps / broadcastRate) === 0) {
      this.broadcastSnapshot(snapshot);
    }

    this.nextTimestep += TIMESTEP;

    // console.log("Update took: ", this.now() - start, " ms")
  }

  takeSnapshot(snapshot) {
    this.snapshotHistory.push(this.frame, snapshot);
  }

  endRound() {
    this.activeUsers.broadcastAll('round over');

    setTimeout(() => {
      this.stopGame();
    }, 5000)
  }

  enqueueActiveUsers() {
    this.activeUsers.forEach(user => {
      this.playerIds[user.playerId] = null;
      this.waitingQueue.enqueue(user);
    })
  }

  stopGame() {
    clearInterval(this.targetScoreInterval);
    clearImmediate(this.gameLoop);
    this.gameIsRunning = false;

    this.enqueueActiveUsers();
    this.resetGame();
    this.fillActiveUsers();

    this.users.broadcastAll('game over');
    this.broadcastUserList();
  }

  resetGame() {
    this.activeUsers = new UserCollection();
    this.engine = Engine.create();
    this.engine.world.gravity.y = 1
    this.frame = 0;
    this.inputBuffer = new InputBuffer();
    this.gameLoop = undefined;
    this.chips = {};
    this.pegs = [];
    this.winner = false;
    this.initializeScore();
    this.createEnvironment();
    this.registerPhysicsEvents();
  }

  generateSnapshot(chips, pegs, score, winner, targetScore) {
    // chips is an object with combinedId as the key and chip as values
    // so we want to access the values
    chips = Object.values(chips);

    const chipInfo = chips.map(chip => {
      return {
           id: chip.id,
           ownerId: chip.ownerId,
           x: chip.body.position.x,
           y: chip.body.position.y,
           angle: chip.body.angle,
           velocity: chip.body.velocity,
           angularVelocity: chip.body.angularVelocity,
         };
    });

    const pegInfo = pegs.map(peg => {
      return { id: peg.id, ownerId: peg.ownerId };
    });

    return { chips: chipInfo, pegs: pegInfo, score, winner, targetScore }
  }

  broadcastSnapshot({ chips, pegs, score, winner, targetScore }) {
    // let encodedSnapshot = Serializer.encode({ chips, pegs, score, winner, targetScore })
    const start = this.now();
    this.activeUsers.forEach(user => {
      user.socket.emit(SNAPSHOT, { frame: this.frame, chips, pegs, score, winner, targetScore });
    })
    console.log(`Broadcast step took : ${this.now() - start}`)
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
    const triangles = [
                      { x: 772, y: 290, side: 'right' },
                      { x: 772, y: 158, side: 'right' },
                      { x: 772, y: 422, side: 'right' },
                      { x: 28,  y: 305, side: 'left' },
                      { x: 28,  y: 173, side: 'left' },
                      { x: 28,  y: 437, side: 'left' },
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
