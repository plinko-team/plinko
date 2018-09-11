import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WinnerBanner from './WinnerBanner';
import ScoreList from './ScoreList';

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
    gameEnded: false,
    targetScore: 63,
    players: {},
  }

  componentDidMount() {
    const playerId = this.props.players[this.props.userId].playerId;
    this.setState({players: this.props.players});
    this.client = new ClientEngine({ playerId, socket: this.props.socket });
    this.registerSocketEvents();
    this.client.init();
    this.client.startGame();
  }

  componentWillUnmount() {
    // unregister socket events on unmount
    this.client.stopGame();
    this.props.socket.off(SNAPSHOT);
  }

  registerSocketEvents = () => {
    this.props.socket.on('game over', () => {
      this.client.stopGame();
      this.props.socket.off(SNAPSHOT);
    })

    this.props.socket.on(SNAPSHOT, (encodedSnapshot) => {

      let { score, winner, targetScore } = Serializer.decode(encodedSnapshot);

      // let { score, winner, targetScore } = encodedSnapshot;
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
          gameEnded: winner,
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

  if (this.state.gameEnded) {
    const userIds = Object.keys(this.state.players);
    winningUserId = userIds.find(id => this.state.players[id].score >= this.state.targetScore && this.state.players[id].score !== 0);

    if (winningUserId) {
      winningPlayerId = this.state.players[winningUserId].playerId;
    }
  }

  return (
    <main>
      {this.state.gameEnded && this.generateWinnerBanner(winningUserId)}

        <div className="game-container">
          <ScoreList {...this.props}
            userId={this.props.userId}
            players={this.state.players}
            targetScore={this.state.targetScore}
            winnerId={winningPlayerId}
          />

          <div className="canvas-container">
            <canvas id="canvas"></canvas>
          </div>
        </div>
      </main>
    )
  }
}
