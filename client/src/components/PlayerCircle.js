import React from 'react';
import PropTypes from 'prop-types';

import RoughCircle from './RoughCircle.js';
import { PLAYER_COLORS } from '../shared/constants/colors';

const PlayerCircle = ({ playerId }) => {
  let fill;
  if (playerId) {
    fill = PLAYER_COLORS[playerId];
  } else {
    fill = '#ffffff';
  }

  const options = {
    fill,
    fillStyle: 'solid',
    roughness: 0.5,
    strokeWidth: 0.6,
  }

  return (
    <RoughCircle
      diameter={20}
      options={options}
      animate={true}
    />
  )
}

PlayerCircle.propTypes = {
  playerId: PropTypes.string,
}

export default PlayerCircle;
