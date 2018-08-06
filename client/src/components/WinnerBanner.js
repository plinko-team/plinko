import React from 'react';
import PropTypes from 'prop-types';

import NewGameButton from './NewGameButton';

const WinnerBanner = ({ winnerName, winningPlayerId, handleNewGameClick }) => {
  return (
    <div className={"winner-banner player-" + winningPlayerId}>
      {winnerName} won!
      <NewGameButton handleClick={handleNewGameClick} />
    </div>
  );
}

WinnerBanner.propTypes = {
  winnerName: PropTypes.string,
  winningPlayerId: PropTypes.string,
  handleNewGameClick: PropTypes.func,
}

export default WinnerBanner;
