import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import WinnerBanner from './WinnerBanner';

import ClientEngine from '../game/clientEngine';
import { SNAPSHOT } from '../shared/constants/events';
import Serializer from '../shared/serializer';

export default class Game extends Component {
  static propTypes = {
    socket: PropTypes.object,
    userId: PropTypes.string,
    players: PropTypes.object,
  }

  state = {
    someoneWon: false,
    targetScore: 63,
    players: {},
  }

  componentDidMount() {
    // this.setState({targetScore: 50, someoneWon: true});
    const playerId = this.props.players[this.props.userId].playerId;
    this.setState({players: this.props.players});
    this.client = new ClientEngine({ playerId, socket: this.props.socket });
    this.registerSocketEvents();
    this.client.init();
    this.client.startGame();
  }

  componentWillUnmount() {
    // unregister socket events on unmount
    this.props.socket.off(SNAPSHOT);
  }

  registerSocketEvents = () => {
    this.props.socket.on(SNAPSHOT, ({ score, winner, targetScore }) => {
      this.setState((prevState) => {
        const newPlayers = {};

        Object.keys(prevState.players).forEach(userId => {
          // UserId is a shortid uuid string

          let player = prevState.players[userId];
          let playerScore = score[player.playerId];

          newPlayers[userId] = Object.assign({}, player, { score: playerScore })
        });

        return {
          targetScore,
          players: newPlayers,
          someoneWon: winner,
        }
      })
    });
  }

generateWinnerBanner = (winningUserId) => {
  if (winningUserId) {
    return (
      <WinnerBanner
        winnerName={this.state.players[winningUserId].name}
        winningPlayerId={this.state.players[winningUserId].playerId}
        />
      )
    } else {
      return (
        <WinnerBanner
        winnerName={"No one "}
        winningPlayerId={''}
      />
    )
  }
}

render() {
  let winningPlayerId;
  let winningUserId;

  if (this.state.someoneWon) {
    const userIds = Object.keys(this.state.players);
    winningUserId = userIds.find(id => this.state.players[id].score >= this.state.targetScore && this.state.players[id].score !== 0);

    if (winningUserId) { 
      winningPlayerId = this.state.players[winningUserId].playerId;
    }
  }

  return (
    <main>
      <Header
        players={this.state.players}
        targetScore={this.state.targetScore}
        winnerId={winningPlayerId}
      />

      {this.state.someoneWon && this.generateWinnerBanner(winningUserId)}

        <div className="canvas"></div>
      </main>
    )
  }
}
