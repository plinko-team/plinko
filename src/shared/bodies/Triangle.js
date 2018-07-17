import { Bodies, Vertices } from 'matter-js';
import { TRIANGLE_FRICTION, TRIANGLE_RESTITUTION, TRIANGLE_X_OFFSET, TRIANGLE_Y_OFFSET } from '../constants/bodies';
import { WALL_TINT } from '../constants/colors';
import { TRIANGLE_SPRITE } from '../constants/sprites';
import GameObject from './GameObject';
import engine from '../../client/engine'

import decomp from 'poly-decomp';

window.decomp = decomp;

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

export default class Triangle extends GameObject {
  constructor({ x, y }) {
    super({ x, y })

    this.xOffset = TRIANGLE_X_OFFSET;
    this.yOffset = TRIANGLE_Y_OFFSET;

    this.createPhysics();
    if (typeof window === 'object') { this.createSprite() };
  }

  createPhysics() {
    let options = {
      restitution: TRIANGLE_RESTITUTION,
      friction: TRIANGLE_FRICTION,
    }

    let triangleVertices = Vertices.fromPath('50 150 15 75 50 0')

    // The simulated triangle is created based on the x, y passed in PLUS their respective offsets
    this.body = Bodies.fromVertices(this.x + this.xOffset, this.y + this.yOffset, [triangleVertices], options)
    this.body.isStatic = true;
  }

  createSprite() {
    const triangle = new PIXI.Sprite.fromImage(TRIANGLE_SPRITE);

    // The sprite is located based on the actual x, y passed into Triangle
    triangle.position.x = this.x;
    triangle.position.y = this.y;
    triangle.scale.set(0.33, 0.33);
    triangle.anchor.set(0.5, 0.5);
    triangle.tint = WALL_TINT;

    this.sprite = triangle;
  }
}
