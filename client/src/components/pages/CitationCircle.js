import React from 'react';

import RoughCircle from '../RoughCircle.js';

const CitationCircle = () => {
  const options = {
    fill: '#765daf',
    fillStyle: 'zigzag',
    fillWeight: .5,
    roughness: 0.3,
    strokeWidth: .7,
  }

  return (
    <RoughCircle
      diameter={15}
      options={options}
    />
  )
}

export default CitationCircle;
