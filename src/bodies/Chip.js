import { Bodies } from 'matter-js';
import { Events, Body } from 'matter-js'

import GameObject from './GameObject';
import { CHIP } from '../shared/constants/bodies';

export default class Chip extends GameObject {
  static count = 0;

  constructor({ id, x, y, ownerId }) {
    super({ id, x, y, ownerId });
    this.type = 'chip';
    this.createPhysics();
    this.body.parentObject = this;

    Chip.count++;
    console.log("CHIP++ ", Chip.count)

  }

  createPhysics() {
    const options = {
      restitution: CHIP.RESTITUTION,
      friction: CHIP.FRICTION,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP.RADIUS, options);

    Body.setDensity(this.body, CHIP.DENSITY)
    this.body.label = this.type;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }

  shrink(callback) {
    if (this.shrinking) { return }
    this.shrinking = true;

    setTimeout(() => {
      // 1 + Math.log(0.95) / N
      // where N is number of chips before max shrinking
      // Here, it is 0.995 for N = 10
      // 0.95 is max shrinking factor

      const SHRINK_FACTOR = Math.max(0.95, Math.min(0.995, 0.995 ** Chip.count));

      const interval = setInterval(() => {
        Body.scale(this.body, SHRINK_FACTOR, SHRINK_FACTOR)
        this.body.circleRadius *= SHRINK_FACTOR

        if (this.body.circleRadius < 0.1) {
          Chip.count--;
          clearInterval(interval);
          callback();
        }
      }, 10)
    }, 50)
  }
}
