import { Bodies } from 'matter-js';

import GameObject from './GameObject';
import { WALL } from '../shared/constants/bodies';
import { CANVAS } from '../shared/constants/canvas';

class Wall extends GameObject {
  constructor({ x, y, width, height }) {
    super({ x, y })
    this.width = width;
    this.height = height;
    this.createPhysics({ width, height });
  }

  createPhysics({width, height}) {
    let options = {
      restitution: WALL.RESTITUTION,
      friction: WALL.FRICTION,
    }

    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    this.body.isStatic = true;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.label = this.type;
  }
}

export class VerticalWall extends Wall {
  constructor({x, y}) {
    super({x, y, width: 4, height: CANVAS.HEIGHT});
  }
}

export class HorizontalWall extends Wall {
  constructor() {
    super({
      x: CANVAS.WIDTH / 2,
      y: CANVAS.HEIGHT,
      width: CANVAS.WIDTH,
      height: 10
    })
    this.body.label = 'ground'
  }
}

export class BucketWall extends Wall {
  constructor({ x }) {
    super({ x, y: CANVAS.HEIGHT - 50, width: 5, height: 130 });
  }
}
