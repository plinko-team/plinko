import React from 'react';
import PropTypes from 'prop-types';

const EndGameButton = ({ handleClick }) => {
  return (
    <button
      className="button-primary two columns offset-by-five"
      onClick={handleClick}
    >
      End Game
    </button>
  );
}

EndGameButton.propTypes = {
  handleClick: PropTypes.func,
}

export default EndGameButton;
