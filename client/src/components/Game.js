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

    this.setState({players: this.props.players});
    this.client = new ClientEngine({ socket: this.props.socket });
    this.registerSocketEvents();
    this.client.init();
    this.client.startGame();
  }

  componentWillUnmount() {
    // unregister socket events on unmount
    this.props.socket.off(SNAPSHOT);
  }

  registerSocketEvents = () => {
    this.props.socket.on(SNAPSHOT, ({ score, targetScore }) => {
      this.setState((prevState) => {
        const newPlayers = {};
        let someoneWon = false;

        Object.keys(prevState.players).map(id => {
          let player = prevState.players[id];
          let playerScore = score[id];

          if (playerScore >= targetScore) {
            someoneWon = true;
          }

          newPlayers[id] = Object.assign({}, player, { score: playerScore })
        });

        return {
          targetScore,
          players: newPlayers,
          someoneWon
        }
      })
    });
  }

  winnerBanner = (winnerId) => {
    return (
      <WinnerBanner
        winnerName={this.state.players[winnerId].name}
        winnerColorId={this.state.players[winnerId].colorId}
        handleNewGameClick={this.props.handleEndGameClick}
      />
    )
  }

  render() {
    let winnerId;

    if (this.state.someoneWon) {
      const userIds = Object.keys(this.state.players);
      winnerId = userIds.find(id => this.state.players[id].score >= this.state.targetScore);
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
