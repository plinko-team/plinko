import ClientEngine from './clientEngine'

const client = new ClientEngine({ url: 'http://radioactive-kitten.localtunnel.me/' });

client.init();
client.startGame();
