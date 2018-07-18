import { Bodies } from 'matter-js';
import { WALL_FRICTION, WALL_RESTITUTION} from '../constants/bodies';
import { WALL_COLOR } from '../constants/colors';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/canvas';
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
    const wall = new PIXI.Sprite.fromImage('https://i.imgur.com/7IFyj9r.png');
    wall.position.x = this.x;
    wall.position.y = this.y;
    wall.height = this.height;
    wall.width = this.width;
    wall.anchor.set(0.5, 0.5);

    this.sprite = wall;
  }
}

export class VerticalWall extends Wall {
  constructor({x, y}) {
    super({x, y, width: 4, height: CANVAS_HEIGHT});
  }
}

export class HorizontalWall extends Wall {
  constructor() {
    super({
      x: CANVAS_WIDTH / 2,
      y: 600,
      width: CANVAS_WIDTH,
      height: 10
    })
    this.body.label = 'ground'
  }
}

export class BucketWall extends Wall {
  constructor({ x }) {
    super({ x, y: CANVAS_HEIGHT - 50, width: 5, height: 130 });
  }
}
