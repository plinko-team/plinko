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
    // gameInProgress when server has a game currently running
    // gameIsRunning when client is part of a game
    gameInProgress: false,
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

  hasUserId() {
    return this.props.userId !== undefined;
  }

  componentDidMount() {
    if (this.hasUserId() && this.hasOpenSocket) {
      console.log('emitting rejoin game')
      this.props.socket.emit('rejoin game', { userId: this.props.userId });

      this.registerSocketEvents(this.props.socket);
      this.setState({
        gameInProgress: false,
        gameIsRunning: false
      })
    }
  }

  componentWillUnmount() {
    if (this.hasOpenSocket) {
      console.log('emitting leave game')
      this.props.socket.emit('leave game');
      this.unregisterSocketEvents()
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
  }

  registerSocketEvents(socket) {
    socket.once('new user ack', ({ userId, gameInProgress }) => {
      this.props.setUserId(userId);
      this.setState({ gameInProgress });

      console.log('userId', userId);
      console.log(`ACK: userId: ${userId}, gameInProgress: ${gameInProgress}`)
    });

    socket.once('rejoin game ack', ({ gameInProgress }) => {
      this.setState({ gameInProgress });
    })

    socket.on('user list', ({ activeUsers, waitingUsers }) => {
      console.log('received user list')
      console.log(activeUsers)
      this.setState({ activeUsers, waitingUsers });
    });

    socket.on('start game', () => {
      console.log("Start game event, set gameIsRunning to true if active")
      this.setState({ gameIsRunning: true });
    })

    socket.on('game started'), () => {
      console.log("Game started event, set gameInProgress to true")

      this.setState({ gameInProgress: true })
    }

    socket.on('game over', () => {
      console.log("Game over event; gameIsRunning and gameInProgress to false")
      this.setState({ gameIsRunning: false,
                      gameInProgress: false,
                      userInGame: false,
                      activeUsers: {}
                     })
    })
  }

  unregisterSocketEvents() {
    this.props.socket.removeAllListeners('connection established');
    this.props.socket.removeAllListeners('new user ack');
    this.props.socket.removeAllListeners('rejoin game ack');
    this.props.socket.removeAllListeners('user list');
    this.props.socket.removeAllListeners('game started')
    this.props.socket.removeAllListeners('start game')
    this.props.socket.removeAllListeners('game over');
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
          gameInProgress={this.state.gameInProgress}
        />
      )
    }
  }
}
