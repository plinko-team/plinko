import engine from './engine';
import { renderer, stage } from './renderer';
import { Render } from 'matter-js';
import ClientGame from './clientGame'
import openSocketConnection from './socket'

const socket = openSocketConnection('http://radioactive-kittenz.localtunnel.me/');

const game = new ClientGame({ renderer, engine, stage });
game.init();
game.startGame();

// Debug renderer
if (false) {
  const r = Render.create({
    element: document.body,
    engine: engine,
  })

  Render.run(r)
}
