import { CHIP } from '../../shared/constants/bodies';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import { toDegrees } from '../../shared/utils/math';
import GameObject from './GameObject';

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
  }

  draw(rough) {
    rough.circle(this.x, this.y, this.diameter, {
      fill: PLAYER_COLORS[this.ownerId],
      fillStyle: this.fillStyle,
      fillWeight: 1,
      roughness: .8,
      hachureAngle: toDegrees(this.angle * -1), // convert to degrees for Rough and switch sign
    });
  }

  shrink(callback) {
    if (this.shrinking) { return }
    this.shrinking = true;

    setTimeout(() => {
      // lower than server shrink factor to account for slower shrinking on client
      const SHRINK_FACTOR = 0.80;

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
