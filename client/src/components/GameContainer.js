import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Game from './Game';
import Lobby from './Lobby';

export default class GameContainer extends Component {
  static propTypes = {
    setUserId: PropTypes.func,
    userId: PropTypes.string,
    socket: PropTypes.object,
    connectToSocket: PropTypes.func,
  }

  state = {
    gameIsRunning: false,
    userInGame: false,
    activeUsers: {},
    waitingUsers: {},
  }

  // activeUsers:
  // {
  //   'fwed23d': {
  //     name: 'Ryann',
  //     playerId: 0,
  //   },
  //   'kjsd9s0': {
  //     name: 'Josh',
  //     playerId: 1,
  //   },
  //   etc.
  // }
  // waitingUsers:
  // {
  //   'lkdweo8': {
  //     name: 'Branko',
  //   },
  //   '3ds-wdf': {
  //     name: 'RK',
  //   },
  //   etc.
  // }

  get hasOpenSocket() {
    return Object.keys(this.props.socket).length > 0;
  }

  componentDidMount() {
    if (this.props.userId !== undefined && this.hasOpenSocket) {
      console.log('emitting rejoin game')
      this.registerSocketEvents(this.props.socket);
      this.props.socket.emit('rejoin game', {userId: this.props.userId});
    }
  }

  componentWillUnmount() {
    if (this.hasOpenSocket) {
      console.log('emitting leave game')
      this.props.socket.emit('leave game');
      this.props.socket.removeAllListeners('connection established');
      this.props.socket.removeAllListeners('new user ack');
      this.props.socket.removeAllListeners('user list');
    }
  }

  handleEndGameClick = () => {
    console.log('This should stop the current game and return users to lobby');
    this.setState({userInGame: false});
  }

  handleStartGameClick = () => {
    console.log('This should move all current users into game');
    this.props.socket.emit('start game');
    this.setState({gameIsRunning: true});
  }

  handleUserJoin = (name) => {
    console.log(`This should submit the new name "${name}" to the server from GameContainer, which should broadcast updated user lists to all users in lobby, which should close the form`)
    const socket = this.props.connectToSocket();

    this.registerSocketEvents(socket);

    socket.on('connection established', ({ message }) => {
      console.log('ESTABLISHED!', message);
      socket.emit('new user', { name })
    });

    socket.on('new user ack', ({ userId }) => {
      this.props.setUserId(userId);
      console.log('userId', userId)
    });
  }

  registerSocketEvents(socket) {
    socket.on('user list', ({ activeUsers, waitingUsers }) => {
      console.log('received user list')
      console.log(activeUsers)
      this.setState({ activeUsers, waitingUsers });
    });
  }

  render() {
    if (this.state.gameIsRunning) {
      return (
        <Game
          socket={this.props.socket}
          userId={this.props.userId}
          players={this.state.activeUsers}
          handleEndGameClick={this.handleEndGameClick}
        />
      )
    } else {
      return (
        <Lobby
          userId={this.props.userId}
          activeUsers={this.state.activeUsers}
          waitingUsers={this.state.waitingUsers}
          gameIsRunning={this.state.gameIsRunning}
          handleStartGameClick={this.handleStartGameClick}
          handleUserJoin={this.handleUserJoin}
        />
      )
    }
  }
}
