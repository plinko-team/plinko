import { CHIP } from '../../shared/constants/bodies';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import { toDegrees } from '../../shared/utils/math';
import GameObject from './GameObject';
import { Events, Body, Bodies } from 'matter-js';

export default class Chip extends GameObject {
  static count = 0;
  static fillStyles = [
    'hachure',
    'zigzag',
    'cross-hatch',
    // 'solid',
  ];

  constructor({ id, x, y, ownerId }) {
    super({ id, x, y, ownerId });
    this.type = 'chip';
    this.diameter = CHIP.DIAMETER;
    this.shrinking = false;
    this.fillStyle = Chip.fillStyles[Math.floor(Math.random() * Chip.fillStyles.length)];
    this.angle = 0; // stored in radians
    Chip.count++;

    this.createPhysics();
  }

  registerUpdateListener(engine) {
    Events.on(engine, 'afterUpdate', () => {
      if (typeof this.bendingCount === 'number') {

        let deltaX = (this.body.position.x - this.x) * (1 / this.bendingCount)
        let deltaY = (this.body.position.y - this.y) * (1 / this.bendingCount)
        let deltaAngle = (this.body.angle - this.angle) * (1 / this.bendingCount)

        this.x += deltaX / this.bendingCount
        this.y += deltaY / this.bendingCount
        this.angle += deltaAngle / this.bendingCount

        this.bendingCount--

        if (this.bendingCount === 0) {
          delete this.bendingCount
        }
      } else {
        this.x = this.body.position.x;
        this.y = this.body.position.y;
        this.angle = this.body.angle;
      }
    })
  }

  createPhysics() {
    Chip.count++

    const options = {
      restitution: CHIP.RESTITUTION,
      friction: CHIP.FRICTION,
    }

    this.body = Bodies.circle(this.x, this.y, CHIP.RADIUS, options);
    this.body.parentObject = this;

    Body.setDensity(this.body, CHIP.DENSITY)
    this.body.label = this.type;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
  }

  draw(rough) {
    let color = this.bendingCount ? '#0000FF' : PLAYER_COLORS[this.ownerId];
    rough.circle(this.x, this.y, this.diameter, {
      fill: color,
      fillStyle: this.fillStyle,
      fillWeight: 1,
      roughness: 1,
      hachureAngle: toDegrees(this.angle * -1), // convert to degrees for Rough and switch sign
    });
  }

  shrink(callback) {
    if (this.shrinking) { return }
    this.shrinking = true;

    setTimeout(() => {
      // 1 + Math.log(0.95) / N
      // where N is number of chips before max shrinking
      // Here, it is 0.995 for N = 10
      // 0.95 is max shrinking factor

      const SHRINK_FACTOR = 0.93;

      const interval = setInterval(() => {
        this.diameter *= SHRINK_FACTOR;

        if (this.diameter < 3) {
          Chip.count--;
          clearInterval(interval);
          if (callback) callback();
        }
      }, 10)
    }, 50)
  }
}
