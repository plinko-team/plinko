import React from 'react';
import PropTypes from 'prop-types';

const StartGameButton = ({ handleClick }) => {
  return (
    <button className={"button-primary start"} onClick={handleClick}>
      Start Game
    </button>
  );
}

StartGameButton.propTypes = {
  handleClick: PropTypes.func,
}

export default StartGameButton;
