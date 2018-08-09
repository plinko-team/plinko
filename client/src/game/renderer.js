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
    this.stage[body.id] = body;
    console.log(this.stage)
  }

  removeFromStage(body) {
    if (this.stage[body.id]) {
      delete this.stage[body.id];
    }
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    Object.values(this.stage).forEach(body => {
      body.drawSprite(this.rough)
    });
    // draw every body in stage - body.drawSprite(x, y)
  }
}
