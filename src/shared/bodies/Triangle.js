import { Bodies, Vertices } from 'matter-js';
import {  TRIANGLE } from '../constants/bodies';
import { TRIANGLE_LEFT_SPRITE, TRIANGLE_RIGHT_SPRITE } from '../constants/sprites';
import { WALL_TINT } from '../constants/colors';
import GameObject from './GameObject';
import engine from '../../client/engine'
import decomp from 'poly-decomp';

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
  window.decomp = decomp;
}

export default class Triangle extends GameObject {
  constructor({ x, y, side }) {
    super({ x, y })
    this.side = side;
    this.vertices = side === 'right' ? TRIANGLE.RIGHT.VERTICES : TRIANGLE.LEFT.VERTICES;
    this.createPhysics();
    if (typeof window === 'object') { this.createSprite() };

  }

  createPhysics() {
    let options = {
      restitution: TRIANGLE.RESTITUTION,
      friction: TRIANGLE.FRICTION,
    }

    let triangleVertices = Vertices.fromPath(this.vertices);

    // The simulated triangle is created based on the x, y passed in plus/minus their respective offsets
    if (this.side === 'left') {
      this.body = Bodies.fromVertices(this.x - TRIANGLE.LEFT.X_OFFSET, this.y - TRIANGLE.LEFT.Y_OFFSET, [triangleVertices], options)
    } else {
      this.body = Bodies.fromVertices(this.x + TRIANGLE.RIGHT.X_OFFSET, this.y + TRIANGLE.RIGHT.Y_OFFSET, [triangleVertices], options)
    }
    this.body.isStatic = true;
  }

  createSprite() {
    const sprite = this.side === 'left' ? TRIANGLE_LEFT_SPRITE : TRIANGLE_RIGHT_SPRITE;
    const triangle = new PIXI.Sprite.fromImage(sprite);

    // The sprite is located based on the actual x, y passed into Triangle
    triangle.position.x = this.x;
    triangle.position.y = this.y;
    triangle.scale.set(0.33, 0.33);
    triangle.anchor.set(0.5, 0.5);
    triangle.tint = WALL_TINT;

    this.sprite = triangle;
  }
}
