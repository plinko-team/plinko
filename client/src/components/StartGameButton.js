import React from 'react';
import PropTypes from 'prop-types';
import { WiredButton } from 'wired-button';

const StartGameButton = ({ handleClick }) => {
  return (
    <wired-button onClick={handleClick} elevation="3">
      Start Game
    </wired-button>
  );
}

StartGameButton.propTypes = {
  handleClick: PropTypes.func,
}

export default StartGameButton;
