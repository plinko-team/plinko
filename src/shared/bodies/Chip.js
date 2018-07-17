import { Bodies, World } from 'matter-js'
import { CHIP_RADIUS } from '../constants/gameEngine'

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

export default class Chip {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.type = 'chip';
    this.createPhysics();
    if (typeof window === 'object') { this.createSprite() };
  }

  createSprite() {
    this.sprite = PIXI.Graphics();
    this.sprite.beginFill(0x334455);
    this.sprite.drawCircle(this.x, this.y, CHIP_RADIUS);
    this.sprite.endFill();
  }

  createPhysics() {
    const options = {
      restitution: .5,
      friction: 0,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP_RADIUS, options);
  }

  addToRenderer(stage) {
    stage.addChild(this.sprite);
  }

  addToEngine(world) {
    World.add(world, this.body);
  }
}
