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
    gameIsRunning: false, // a game is currently running
    userInGame: false,     // the user is part of the currently running game
    activeUsers: {},     // users in top 4, will include this user if userInGame OR user is up in next round
    waitingUsers: {},    // users below top 4, may include this user
  }

  componentDidMount() {
    if (this.props.userId !== undefined) {
      const socket = this.connectToSocket();
      socket.emit('reconnection', {userId: this.props.userId});
    }

    // this.setState(() => {
    //   return {
    //     userName: '',
    //     gameIsRunning: false,
    //     activeUsers: {
    //       0: {
    //         name: 'Branko',
    //         score: 0,
    //         colorId: 0,
    //       },
    //       1: {
    //         name: 'Josh',
    //         score: 0,
    //         colorId: 1,
    //       },
    //       2: {
    //         name: 'Ryann',
    //         score: 0,
    //         colorId: 2,
    //       },
    //       3: {
    //         name: 'Longest Name 15',
    //         score: 0,
    //         colorId: 3,
    //       },
    //     },
    //     waitingUsers: {
    //       41231: {
    //         name: 'Poor Schmuck',
    //       },
    //       75654: {
    //         name: 'Sad Sack',
    //       }
    //     }
    //   }
    // });
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
