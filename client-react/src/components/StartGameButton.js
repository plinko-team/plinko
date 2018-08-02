import React from 'react';
import PropTypes from 'prop-types';

const StartGameButton = ({ handleClick, columnCount }) => {
  return (
    <button
      className={`button-primary ${columnCount} columns offset-by-three`}
      onClick={handleClick}
    >
      Start Game
    </button>
  );
}

StartGameButton.propTypes = {
  handleClick: PropTypes.func,
  columnCount: PropTypes.string,
}

export default StartGameButton;
