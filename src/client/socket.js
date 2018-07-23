import io from 'socket.io-client';

/**

  TODO: Write description

**/

function openSocketConnection(url) {
  const socket = io.connect(url);

  socket.on('connection established', ({ playerId }) => {
    console.log('ESTABLISHED! Your player ID is: ', playerId);
    window.playerId = playerId;
  })

  return socket;
}

export default openSocketConnection
