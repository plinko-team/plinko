import io from 'socket.io-client';

import { CONNECTION_ESTABLISHED } from '../shared/constants/events'

/**

  TODO: Write description

**/

function openSocketConnection(url) {
  const socket = io.connect(url);
  return socket;
}

export default openSocketConnection
