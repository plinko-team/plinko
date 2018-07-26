import ClientEngine from './clientEngine'

const client = new ClientEngine({ url: 'http://radioactive-kittens.localtunnel.me/' });

client.init();
client.startGame();
