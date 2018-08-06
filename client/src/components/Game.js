import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import EndGameButton from './EndGameButton';
import WinnerBanner from './WinnerBanner';

import ClientEngine from '../game/clientEngine';
import { SNAPSHOT } from '../shared/constants/events';
import Serializer from '../shared/serializer';

export default class Game extends Component {
  static propTypes = {
    socket: PropTypes.object,
    userId: PropTypes.string,
    players: PropTypes.object,
    handleEndGameClick: PropTypes.func,
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

  winnerBanner = (winnerId) => {
    return (
      <WinnerBanner
        winnerName={this.state.players[winnerId].name}
        winnerplayerId={this.state.players[this.props.userId].playerId}
        handleNewGameClick={this.props.handleEndGameClick}
      />
    )
  }

  render() {
    let winnerId;

    if (this.state.someoneWon) {
      const userIds = Object.keys(this.state.players);
      const winningUserId = userIds.find(id => this.state.players[id].score >= this.state.targetScore);
      winnerId = this.state.players[winningUserId].playerId;
    }

    return (
      <main>
        <Header
          players={this.state.players}
          targetScore={this.state.targetScore}
          winnerId={winnerId}
        />

        {winnerId !== undefined && this.winnerBanner(winnerId)}

        <div className="canvas"></div>

        <EndGameButton handleClick={this.props.handleEndGameClick} />
      </main>
    )
  }
}
