import React from 'react';
import PropTypes from 'prop-types';

import NewGameButton from './NewGameButton';

const WinnerBanner = ({ winnerName, winnerColorId, handleNewGameClick }) => {
  if (winnerName === undefined) { winnerName = 'No one '}
  if (winnerColorId === undefined) { winnerColorId = 0 }
  
  return (
    <div className={"winner-banner player-color-" + winnerColorId}>
    {winnerName} won!
      <NewGameButton handleClick={handleNewGameClick} />
    </div>
  );
}

NewGameButton.propTypes = {
  winnerName: PropTypes.string,
  winnerColorId: PropTypes.string,
  handleNewGameClick: PropTypes.func,
}

export default WinnerBanner;
