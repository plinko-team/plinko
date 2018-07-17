import { TIMESTEP } from '../shared/constants/game';
import { Engine } from 'matter-js';

export default class GameLoop {
  constructor({ engine, renderer, stage }) {
    this.engine = engine;
    this.renderer = renderer;
    this.stage = stage;
  }

  start() {
    this.timeStarted = Date.now();
    this.nextTimestep = Date.now();

    this.loop = setInterval(() => {
      while (Date.now() > this.nextTimestep) {
        Engine.update(this.engine, TIMESTEP);
        this.nextTimestep += TIMESTEP;
      }

      this.renderer.render(this.stage);
    }, 0)
  }

  stop() {
    clearInterval(this.loop);
  }
}
