import { Bodies, Vertices } from 'matter-js';

import GameObject from './GameObject';
import { TRIANGLE } from '../shared/constants/bodies';

export default class Triangle extends GameObject {
  constructor({ x, y, side }) {
    super({ x, y })
    this.side = side;
    this.vertices = side === 'right' ? TRIANGLE.RIGHT.VERTICES : TRIANGLE.LEFT.VERTICES;
    this.createPhysics();
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
}
