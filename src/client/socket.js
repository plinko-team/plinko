import io from 'socket.io-client';

function openSocketConnection(url) {
  const socket = io.connect(url);

  socket.on('connection established', () => {
    console.log('ESTABLISHED!')
  })

  return socket;
}

export default openSocketConnection
