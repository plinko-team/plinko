import React from 'react';

import RoughCircle from './RoughCircle.js';

const LogoCircle = () => {
  const options = {
    fill: '#fff',
    fillStyle: 'solid',
    roughness: 0.5,
    strokeWidth: 0.6,
  }

  return (
    <RoughCircle
      diameter={37}
      options={options}
      animate={true}
    />
  )
}

export default LogoCircle;
