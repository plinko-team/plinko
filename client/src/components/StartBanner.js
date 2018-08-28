import React from 'react';
import PropTypes from 'prop-types';

const StartBanner = ({ count }) => {
  return (
    <div className={"banner"}>
      Get ready! Game starts in {count}...
    </div>
  );
}

StartBanner.propTypes = {
  count: PropTypes.number,
}

export default StartBanner;
