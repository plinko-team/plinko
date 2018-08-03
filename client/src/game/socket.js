import io from 'socket.io-client';

import { CONNECTION_ESTABLISHED } from '../shared/constants/events'

/**

  TODO: Write description

**/

function openSocketConnection(url) {
  const socket = io.connect(url);

  socket.on(CONNECTION_ESTABLISHED, ({ playerId }) => {
    console.log('ESTABLISHED! Your player ID is: ', playerId);
    window.playerId = playerId;
  })

  return socket;
}

export default openSocketConnection
