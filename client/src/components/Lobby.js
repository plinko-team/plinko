import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import PlayerJoinForm from './PlayerJoinForm';
import StartGameButton from './StartGameButton';
import StartBanner from './StartBanner';
import PlayerCircle from './PlayerCircle';

export default class Lobby extends Component {
  static propTypes = {
    userId: PropTypes.string,
    activeUsers: PropTypes.object,
    waitingUsers: PropTypes.object,
    gameIsRunning: PropTypes.bool,
    handleStartGameClick: PropTypes.func,
    handleUserJoin: PropTypes.func,
    gameInProgress: PropTypes.bool,
    startBannerVisible: PropTypes.bool,
    startCount: PropTypes.number,
  }

  state = {
    userName: '',
  }

  isActiveUser = () => {
    return Object.keys(this.props.activeUsers).includes(this.props.userId);
  }

  isWaitingUser = () => {
    return Object.keys(this.props.waitingUsers).includes(this.props.userId);
  }

  isNameFormOpen = () => {
    return !this.isActiveUser() && !this.isWaitingUser();
  }

  handleNameChange = (input) => {
    this.setState({
      userName: input,
    });
  }

  handleUserJoin = () => {
    this.props.handleUserJoin(this.state.userName.trim());
  }

  activeUserList = () => {
    if (!!Object.keys(this.props.activeUsers).length) {
      return (
        <div className="active-players row">
          <div className="players-container five columns">
            <h2>Active Players</h2>
            <ul>
              {this.userItems(this.props.activeUsers, true)}
            </ul>
          </div>

          {!this.props.startBannerVisible && this.isActiveUser() && this.startGameButton()}
        </div>
      )
    } else {
      return null;
    }
  }

  waitingUserList = () => {
    if (!!Object.keys(this.props.waitingUsers).length) {
      return (
        <div className="waiting-players">
          <div className="players-container five columns">
            <h2>Waiting Players</h2>
            <ul>
              {this.userItems(this.props.waitingUsers)}
            </ul>
          </div>

          {this.props.gameInProgress && this.isWaitingUser() && this.gameInProgressAlert()}
        </div>
      )
    } else {
      return null;
    }
  }

  userItems = (usersObj, active=false) => {
    return Object.keys(usersObj).map(id => {
      let user = usersObj[id];
      return (
        <li key={"player-" + id} className={active ? "player-" + user.playerId : ""}>
          <PlayerCircle playerId={user.playerId} />
          <span className={id === this.props.userId ? 'bold' : ''}>{user.name}</span>
        </li>
      )
    })
  }

  startGameButton = () => {
    return (
      <div className="button-container three columns offset-by-two">
        <StartGameButton
          handleClick={this.props.handleStartGameClick}
        />
      </div>
    )
  }

  gameInProgressAlert = () => {
    return (
      <div className="card-container three columns offset-by-two">
        <wired-card>
          <p>A game is currently in progress. When it's over, the next waiting players can join.</p>
        </wired-card>
      </div>
    )
  }

  playerInfo = () => {
    if (this.isNameFormOpen()) {
      return (
        <div className="player-info">
          {<PlayerJoinForm userName={this.state.userName} handleSubmit={this.handleUserJoin} handleChange={this.handleNameChange} />}

          <div className="rules">
            <div className="rule">
              <wired-card><h2>Objective</h2></wired-card>
              <p>Hit the pegs as fast as you can to change their color.</p>
            </div>
            <div className="rule">
              <wired-card><h2>Playing with friends?</h2></wired-card>
              <p>Reach the target peg percentage before anyone else.</p>
              <p>Watch out! Other players can steal your pegs.</p>
            </div>
            <div className="rule">
              <wired-card><h2>Playing alone? </h2></wired-card>
              <p>Reach the target peg percentage as fast as you can.</p>
              <p>Can you hit 80% of pegs? 90%?!</p>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="player-info">
            {this.activeUserList()}
            {this.waitingUserList()}
          </div>

          <div className="reminder">
            <p>Forget the rules and don't want to wing it? Get <NavLink to="help">help</NavLink>.</p>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <main>
        <div className="main-content lobby">
          {this.props.startBannerVisible && <StartBanner count={this.props.startCount} />}
          {this.playerInfo()}
        </div>
      </main>
    )
  }
}
