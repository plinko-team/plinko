import React, { Component } from 'react';

import Game from './Game';
import Lobby from './Lobby';

export default class GameContainer extends Component {
  // these will likely change after integration
  // e.g. we may need to differentiate between "active players" (top 4),
  // some of whom may be waiting for the next game to start, and
  // "currently playing players," who are all playing now
  state = {
    userId: undefined,
    gameInProgress: false, // a game is currently running
    userInGame: false,     // the user is part of the currently running game
    activePlayers: {},     // users in top 4, will include this user if userInGame OR user is up in next round
    waitingPlayers: {},    // users below top 4, may include this user
  }

  componentDidMount() {
    this.setState(() => {
      return {
        userId: "81340",
        userName: '',
        gameInProgress: false,
        activePlayers: {
          81340: {
            name: 'Branko',
            score: 36,
            colorId: 0,
          },
          34059: {
            name: 'Josh',
            score: 50,
            colorId: 1,
          },
          53452: {
            name: 'Ryann',
            score: 29,
            colorId: 2,
          },
          21432: {
            name: 'Longest Name 15',
            score: 12,
            colorId: 3,
          },
        },
        waitingPlayers: {
          41231: {
            name: 'Poor Schmuck',
          },
          75654: {
            name: 'Sad Sack',
          }
        }
      }
    });
  }

  handleEndGameClick = () => {
    console.log('This should stop the current game and return users to lobby');
    this.setState({userInGame: false});
  }

  handleStartGameClick = () => {
    console.log('This should start a new game with the top 4 players in lobby');
    this.setState({userInGame: true});
  }

  handleNameSubmit = (name) => {
    console.log(`This should submit the new name "${name}" to the server from GameContainer, which should broadcast updated player lists to all players in lobby, which should close the form`)
  }

  render() {
    if (this.state.userInGame) {
      return (
        <Game
          players={this.state.activePlayers}
          handleEndGameClick={this.handleEndGameClick}
        />
      )
    } else {
      return (
        <Lobby
          userId={this.state.userId}
          activePlayers={this.state.activePlayers}
          waitingPlayers={this.state.waitingPlayers}
          gameInProgress={this.state.gameInProgress}
          isNameFormOpen={this.state.isNameFormOpen}
          handleStartGameClick={this.handleStartGameClick}
          handleNameSubmit={this.handleNameSubmit}
        />
      )
    }
  }
}
