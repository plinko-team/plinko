import ClientEngine from './clientEngine'

const client = new ClientEngine({ url: 'http://radioactive-kittenz.localtunnel.me/' });

client.init();
client.startGame();
