import Game from './game'
import engine from './engine';
import { renderer, stage } from './renderer';
import { Render } from 'matter-js'
const game = new Game({ renderer, engine, stage })
game.init().start();

// Debug renderer
if (false) {
  const r = Render.create({
    element: document.body,
    engine: engine,
  })

  Render.run(r)
}
