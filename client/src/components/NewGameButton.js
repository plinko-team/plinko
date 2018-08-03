import React from 'react';
import PropTypes from 'prop-types';

const NewGameButton = ({ handleClick }) => {
  return (
    <button
      className="button-primary"
      onClick={handleClick}
    >
      New Game
    </button>
  );
}

NewGameButton.propTypes = {
  handleClick: PropTypes.func,
}

export default NewGameButton;
