import React from 'react';
import PropTypes from 'prop-types';
import { WiredButton } from 'wired-elements';

const StartGameButton = ({ handleClick }) => {
  const buttonStyles = {
    width: '150px',
    height: '50px',
  }

  return (
    <wired-button style={buttonStyles} onClick={handleClick} elevation="3">
      Start Game
    </wired-button>
  );
}

StartGameButton.propTypes = {
  handleClick: PropTypes.func,
}

export default StartGameButton;
