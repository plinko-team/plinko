import io from 'socket.io-client';

/**

  TODO: Write description

**/

function openSocketConnection(url) {
  const socket = io.connect(url);
  return socket;
}

export default openSocketConnection
