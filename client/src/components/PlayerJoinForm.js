import React from 'react';
import PropTypes from 'prop-types';

const PlayerJoinForm = ({ userName, isJoinDisabled, handleSubmit, handleChange }) => {
  const updateName = (e) => {
    handleChange(e.target.value);
  }

  const joinGame = (e) => {
    handleSubmit();
  }

  const handleKeyUp = (e) => {
    // if user pressed enter key
    if (e.keyCode === 13) {
      joinGame();
    }
  }

  return (
    <div className="name-form">
      <input type="text" placeholder="Your Name" value={userName} onChange={updateName} onKeyUp={handleKeyUp} maxLength="15"/>
      <button className={"join button-primary"} disabled={isJoinDisabled} onClick={joinGame}>Join</button>
    </div>
  )
}

PlayerJoinForm.propTypes = {
  userName: PropTypes.string,
  isJoinDisabled: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
}

export default PlayerJoinForm;
