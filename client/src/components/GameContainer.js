import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Game from './Game';
import Lobby from './Lobby';

import openSocketConnection from '../game/socket';

export default class GameContainer extends Component {
  static propTypes = {
    setUserId: PropTypes.func,
    userId: PropTypes.string,
  }

  state = {
    socket: {},
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

  componentDidMount() {
    if (this.props.userId !== undefined) {
      const socket = this.connectToSocket();
      socket.emit('reconnection', {userId: this.props.userId});
    }
  }

  componentWillUnmount() {
    // if (Object.keys(this.state.socket).length > 0) {
    //   this.disconnectFromSocket();
    // }
  }

  connectToSocket = () => {
    const socket = openSocketConnection('localhost:3001');
    this.setState({ socket });

    return socket;
  }

  disconnectFromSocket = () => {
    this.state.socket.disconnect(true);
    console.log('Disconnected!');
  }

  handleEndGameClick = () => {
    console.log('This should stop the current game and return users to lobby');
    this.setState({userInGame: false});
  }

  handleStartGameClick = () => {
    console.log('This should start a new game with the top 4 users in lobby');
    this.state.socket.emit('start game');
    this.setState({gameIsRunning: true});
  }

  handleUserJoin = (name) => {
    console.log(`This should submit the new name "${name}" to the server from GameContainer, which should broadcast updated user lists to all users in lobby, which should close the form`)
    const socket = this.connectToSocket();

    socket.on('connection established', ({ message }) => {
      console.log('ESTABLISHED!', message);
      socket.emit('new user', { name })
    });

    socket.on('new user ack', ({ userId }) => {
      this.props.setUserId(userId);
      console.log('userId', userId)
    });

    socket.on('user list', ({ activeUsers, waitingUsers }) => {
      this.setState({ activeUsers, waitingUsers });
    });
  }

  render() {
    if (this.state.gameIsRunning) {
      return (
        <Game
          socket={this.state.socket}
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
          isNameFormOpen={this.state.isNameFormOpen}
          handleStartGameClick={this.handleStartGameClick}
          handleUserJoin={this.handleUserJoin}
        />
      )
    }
  }
}
