import React from 'react';
import PropTypes from 'prop-types';
import { WiredCard } from 'wired-card';

const Aside = ({ emphasized, children }) => {
  const elevation = emphasized ? "4" : "2";
  const klass = emphasized ? ' emphasized' : '';

  return (
    <div className={'aside-container' + klass}>
      <wired-card elevation={elevation}>
        <aside>
          {children}
        </aside>
      </wired-card>
    </div>
  )
}

Aside.propTypes = {
  emphasized: PropTypes.bool,
}

export default Aside;
