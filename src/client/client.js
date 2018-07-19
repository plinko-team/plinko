import { renderer, stage } from './renderer';
import { Render } from 'matter-js';
import ClientGame from './clientGame';
import openSocketConnection from './socket';

const socket = openSocketConnection('http://radioactive-kittenz.localtunnel.me/');

const game = new ClientGame({ renderer, stage, socket });

game.init();
game.startGame();

// Debug renderer; sent next line to true if you want to view debug
if (false) {
  const r = Render.create({
    element: document.body,
    engine: engine,
  })

  Render.run(r);
}
