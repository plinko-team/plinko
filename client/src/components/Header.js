import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import ScoreList from './ScoreList';

export default class Header extends Component {
  static propTypes = {
    userId: PropTypes.string,
    players: PropTypes.object,
    targetScore: PropTypes.number,
    winnerId: PropTypes.string,
  }

  isInsideGame = () => {
    return this.props.players !== undefined
  }

  render() {
    return (
      <div className="header-container">
        <header className="row">
          <h1 className="four columns">
            <NavLink to="/">Plinko</NavLink>
          </h1>

          {this.isInsideGame() && <ScoreList {...this.props} columnCount="eight" />}
        </header>
      </div>
    )
  }
}
