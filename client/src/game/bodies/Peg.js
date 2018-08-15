import { Body, Bodies } from 'matter-js';

import { PEG } from '../../shared/constants/bodies';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import GameObject from './GameObject';

export default class Peg extends GameObject {
  constructor({ id, x, y }) {
    super({ id, x, y });
    this.ownerId = null;
    this.type = 'peg';
    this.createPhysics();
  }

  createPhysics() {
    let options = {
      friction: PEG.FRICTION,
      restitution: PEG.RESTITUTION,
    }

    this.body = Bodies.circle(this.x, this.y, PEG.RADIUS, options);

    this.body.parentObject = this;

    Body.setDensity(this.body, 1)
    this.body.isStatic = true;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.label = this.type;
    this.body.isShrinking = false;
  }

  draw(rough) {
    rough.circle(this.x, this.y, PEG.DIAMETER, {
      fill: PLAYER_COLORS[this.ownerId],
      fillStyle: 'solid',
      roughness: 0.5,
      strokeWidth: 0.7,
    });
  }
}
