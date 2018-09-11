import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Game from './Game';
import Lobby from './Lobby';
import Synchronizer from '../game/synchronizer';

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
    activeUsers: {},
    waitingUsers: {},
    startBannerVisible: false,
    startCount: 5,
  }

  hasOpenSocket() {
    return Object.keys(this.props.socket).length > 0;
  }

  hasUserId() {
    return this.props.userId !== undefined;
  }

  componentDidMount() {
    if (this.hasUserId() && this.hasOpenSocket()) {
      this.props.socket.emit('rejoin game', { userId: this.props.userId });
      this.synchronizer = new Synchronizer(this.props.socket).init();

      this.unregisterSocketEvents(this.props.socket);
      this.registerSocketEvents(this.props.socket);

      this.setState({
        gameInProgress: false,
        gameIsRunning: false
      })
    }
  }

  componentWillUnmount() {
    if (this.hasOpenSocket()) {
      this.props.socket.emit('leave game');
      this.unregisterSocketEvents();
      clearInterval(this.interval);
    }
  }

  handleStartGameClick = () => {
    this.props.socket.emit('start game');
  }

  handleUserJoin = (name) => {
    if (this.hasOpenSocket()) return;

    const socket = this.props.connectToSocket();
    this.synchronizer = new Synchronizer(socket).init();
    this.registerSocketEvents(socket);

    socket.on('connection established', ({ message }) => {
      console.log('Connection established')

      socket.emit('new user', { name })
    });
  }

  registerSocketEvents(socket) {
    socket.once('new user ack', ({ userId, gameInProgress }) => {
      this.props.setUserId(userId);
      this.setState({ gameInProgress });
    });

    socket.once('rejoin game ack', ({ gameInProgress }) => {
      this.setState({ gameInProgress });
    })

    socket.on('user list', ({ activeUsers, waitingUsers }) => {
      this.setState({ activeUsers, waitingUsers });
    });

    socket.on('start game', () => {
      this.synchronizer.handshake()
      .then(latency => {
        console.log('Latency: ', latency);
      })

      this.setState({
        startBannerVisible: true,
      });

      this.interval = setInterval(() => {
        if (this.state.startCount > 1) {
          this.setState((prevState) => {
            return {startCount: prevState.startCount - 1}
          });
        }
      }, 1000);

      socket.once('START', () => {
        this.setState({gameIsRunning: true});
        clearInterval(this.interval);
      })
    })

    socket.on('game started', () => {
      this.setState({ gameInProgress: true });
    })

    socket.on('game over', () => {
      this.setState({
        gameIsRunning: false,
        gameInProgress: false,
        startBannerVisible: false,
        startCount: 5,
       })
    })

    socket.on('round over', () => {
      console.log("Received round over event")
    })
  }

  unregisterSocketEvents(socket) {
    socket = socket || this.props.socket
    socket.removeAllListeners('connection established');
    socket.removeAllListeners('new user ack');
    socket.removeAllListeners('rejoin game ack');
    socket.removeAllListeners('user list');
    socket.removeAllListeners('game started')
    socket.removeAllListeners('start game')
    socket.removeAllListeners('game over');
  }

  render() {
    if (this.state.gameIsRunning) {
      return (
        <Game
          socket={this.props.socket}
          userId={this.props.userId}
          players={this.state.activeUsers}
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
          startBannerVisible={this.state.startBannerVisible}
          startCount={this.state.startCount}
        />
      )
    }
  }
}
