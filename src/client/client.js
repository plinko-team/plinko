import ClientEngine from './clientEngine'

const client = new ClientEngine({ url: 'http://branko-kittens.localtunnel.me/' });

client.init();
client.startGame();
