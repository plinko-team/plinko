import { WALL } from '../../shared/constants/bodies';
import { WALL_TINT } from '../../shared/constants/colors';
import { CANVAS } from '../../shared/constants/canvas';
import GameObject from './GameObject';

let PIXI = require('pixi.js');

class Wall extends GameObject {
  constructor({ x, y, width, height }) {
    super({ x, y })
    this.width = width;
    this.height = height;
    this.createSprite();
  }

  createSprite() {
    const texture = PIXI.Texture.WHITE;
    const wall = new PIXI.Sprite(texture);
    wall.position.x = this.x;
    wall.position.y = this.y;
    wall.height = this.height;
    wall.width = this.width;
    wall.tint = WALL_TINT;
    wall.anchor.set(0.5, 0.5);

    this.sprite = wall;
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
  }
}

export class BucketWall extends Wall {
  constructor({ x }) {
    super({ x, y: CANVAS.HEIGHT - 50, width: 5, height: 130 });
  }
}
