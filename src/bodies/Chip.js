import { Bodies } from 'matter-js';
import { Events, Body } from 'matter-js'

import GameObject from './GameObject';
import { CHIP } from '../shared/constants/bodies';

export default class Chip extends GameObject {
  static count = 0

  constructor({ id, x, y, ownerId }) {
    super({ id, x, y, ownerId });
    this.type = 'chip';
    this.createPhysics();
    this.body.parentObject = this;
  }

  createPhysics() {
    Chip.count++

    const options = {
      restitution: CHIP.RESTITUTION,
      friction: CHIP.FRICTION,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP.RADIUS, options);

    // this.body.mass = 0.01
    // this.body.inverseMass = 1 / this.body.mass

    Body.setDensity(this.body, CHIP.DENSITY)
    this.body.label = this.type;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }

  shrink(callback) {
    setTimeout(() => {
      const SHRINK_FACTOR = 0.95
      const interval = setInterval(() => {
        Body.scale(this.body, SHRINK_FACTOR, SHRINK_FACTOR)
        this.body.circleRadius *= SHRINK_FACTOR

        if (typeof window === 'object') {
          this.sprite.width *= SHRINK_FACTOR
          this.sprite.height *= SHRINK_FACTOR
        }

        if (this.body.circleRadius < 0.1) {
          clearInterval(interval);
          callback();
        }
      }, 10)
    }, 50)
  }
}
