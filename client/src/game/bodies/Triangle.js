import { WALL_TINT } from '../../shared/constants/colors';
import GameObject from './GameObject';
import { Bodies, Vertices } from 'matter-js';
import { TRIANGLE } from '../../shared/constants/bodies'
import { CANVAS } from '../../shared/constants/canvas';
import decomp from 'poly-decomp';

window.decomp = decomp;

export default class Triangle extends GameObject {
  static count = 0;

  constructor({ y, side }) {
    super({ y });
    this.id = Triangle.count++;
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

  draw(rough) {
    const height = 150;
    const width = 35;
    let vertices;

    if (this.side === 'left') {
      vertices = [
        [0, this.y],                                    // top left
        [0 + width, this.y + (height / 2)],             // middle right
        [0, this.y + height],                           // bottom left
      ];
    } else {
      vertices = [
        [CANVAS.WIDTH, this.y],                         // top right
        [CANVAS.WIDTH - width, this.y + (height / 2)],  // middle left
        [CANVAS.WIDTH, this.y + height],                // bottom right
      ]
    }

    rough.polygon(vertices, {
      fill: WALL_TINT,
      stroke: WALL_TINT,
      fillStyle: 'solid',
      roughness: 0.8,
    });
  }
}
