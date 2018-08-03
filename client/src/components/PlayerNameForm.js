import React from 'react';
import PropTypes from 'prop-types';

const PlayerNameForm = ({ userName, handleSubmit, handleChange }) => {
  const updateName = (e) => {
    handleChange(e.target.value);
  }

  const submitName = (e) => {
    // validation here
    handleSubmit();
  }

  return (
    <div className="name-form">
      <input type="text" placeholder="Your Name" value={userName} onChange={updateName} />
      <button className="button-primary" onClick={submitName}>Join</button>
    </div>
  )
}

PlayerNameForm.propTypes = {
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
}

export default PlayerNameForm;
