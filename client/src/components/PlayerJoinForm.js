import React from 'react';
import PropTypes from 'prop-types';

const PlayerJoinForm = ({ userName, handleSubmit, handleChange }) => {
  const updateName = (e) => {
    handleChange(e.target.value);
  }

  const joinGame = (e) => {
    // validation here
    handleSubmit();
  }

  return (
    <div className="name-form">
      <input type="text" placeholder="Your Name" value={userName} onChange={updateName} />
      <button className="button-primary" onClick={joinGame}>Join</button>
    </div>
  )
}

PlayerNameForm.propTypes = {
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
}

export default PlayerJoinForm;
