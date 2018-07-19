import { World, Engine, Events } from 'matter-js';
import { DROP_BOUNDARY, TIMESTEP } from '../shared/constants/game'
import createEnvironment from './setup';

export default class Game {
  constructor({ engine }) {
    this.engine = engine;
    this.chips = [];
  }

  init() {
    createEnvironment(this.stage);
    this.registerPhysicsEvents();
  }

  onCollisionStart = (event) => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.label === 'peg') {
        bodyA.sprite.tint = 0xFFAAAA;
      }
      if (bodyB.label === 'peg') {
        bodyB.sprite.tint = 0xFFAAAA;
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

    this.loop = setInterval(() => {
      while (Date.now() > this.nextTimestep) {
        Engine.update(this.engine, TIMESTEP);
        this.nextTimestep += TIMESTEP;

        this.env === 'client' && this.chips.forEach(chip => {
          chip.sprite.position.x = chip.body.position.x;
          chip.sprite.position.y = chip.body.position.y;
          chip.sprite.rotation = chip.body.angle;
        })
      }

      this.env === 'client' && this.renderer.render(this.stage);
    }, 0)
  }

  stopGame() {
    clearInterval(this.loop);
  }
}
