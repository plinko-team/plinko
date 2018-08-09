import Rough from 'roughjs';

import { CANVAS_COLOR } from '../shared/constants/colors';
import { CANVAS } from '../shared/constants/canvas';

export default class Renderer {
  constructor(options) {
    this.canvas = document.querySelector('#canvas');
    this.canvas.width = CANVAS.WIDTH;
    this.canvas.height = CANVAS.HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    this.rough = Rough.canvas(this.canvas);
    this.generator = this.rough.generator;
    this.stage = {};
  }

  addToStage(body) {
    if (this.stage[body.type + 's'] === undefined) {
      this.stage[body.type + 's'] = {};
    }

    const bodies = this.stage[body.type + 's'];
    bodies[body.id] = body;
    // console.log(this.stage)
  }

  removeFromStage(body) {
    const bodies = this.stage[body.type + 's'];
    if (bodies[body.id]) {
      delete bodies[body.id];
    }
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    Object.values(this.stage).forEach(bodies => {
      Object.values(bodies).forEach(body => {
        body.draw(this.rough);
      });
    });
  }
}
