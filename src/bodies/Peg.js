import { Body, Bodies } from 'matter-js';

import GameObject from './GameObject';
import { PEG } from '../shared/constants/bodies';

export default class Peg extends GameObject {
  constructor({ id, x, y }) {
    super({ id, x, y });
    this.ownerId = null;
    this.type = 'peg';
    this.createPhysics();
    this.body.parentObject = this;
  }

  createPhysics() {
    let options = {
      friction: PEG.FRICTION,
      restitution: PEG.RESTITUTION,
    }

    this.body = Bodies.circle(this.x, this.y, PEG.RADIUS, options);
    Body.setDensity(this.body, 1)
    this.body.isStatic = true;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.label = this.type;
    this.body.isShrinking = false;
  }
}
