import { World, Engine, Events } from 'matter-js';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game';
import { PLAYER_COLORS } from './constants/colors';
import createEnvironment from './setup';

export default class Game {
  constructor() {
    this.engine = Engine.create();
    this.chips = [];
    this.pegs = {};
  }

  init() {
    createEnvironment(this.stage, this.engine);
    this.registerPhysicsEvents();
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

  startGame() {
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
}
