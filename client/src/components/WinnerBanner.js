import React from 'react';
import PropTypes from 'prop-types';

import NewGameButton from './NewGameButton';

const WinnerBanner = ({ winnerName, winnerplayerId, handleNewGameClick }) => {
  return (
    <div className={"winner-banner player-color-" + winnerplayerId}>
      {winnerName} won!
      <NewGameButton handleClick={handleNewGameClick} />
    </div>
  );
}

WinnerBanner.propTypes = {
  winnerName: PropTypes.string,
  winnerplayerId: PropTypes.string,
  handleNewGameClick: PropTypes.func,
}

export default WinnerBanner;
