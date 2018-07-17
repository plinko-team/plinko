import { Bodies } from 'matter-js';
import { WALL_FRICTION, WALL_RESTITUTION} from '../constants/bodies';
import { WALL_COLOR } from '../constants/colors';
import { CANVAS_HEIGHT } from '../constants/canvas';
import GameObject from './GameObject';

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

class Wall extends GameObject {
  constructor({ x, y, width, height }) {
    super({ x, y })
    this.width = width;
    this.height = height;
    this.createPhysics({ width, height });
    if (typeof window === 'object') { this.createSprite() };
  }

  createPhysics({width, height}) {
    let options = {
      restitution: WALL_RESTITUTION,
      friction: WALL_FRICTION,
    }

    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    this.body.isStatic = true;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.label = this.type;
  }

  createSprite() {
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(WALL_COLOR);
    this.sprite.drawRect(this.x, this.y, this.width, this.height);
    this.sprite.endFill();
  }
}

export class VerticalWall extends Wall {
  constructor({x, y}) {
    super({x, y, width: 5, height: 500});
  }
}

export class HorizontalWall extends Wall {
  constructor() {
    super({
      x: 0,
      y: 590,
      width: 800,
      height: 10
    });
  }
}

export class BucketWall extends Wall {
  constructor({ x }) {
    super({ x, y: CANVAS_HEIGHT - 100, width: 5, height: 100 });
  }
}
