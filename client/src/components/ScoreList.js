import React from 'react';
import PropTypes from 'prop-types';

import ScoreBar from './ScoreBar';

const ScoreList = ({ players, targetScore, winnerId, columnCount }) => {
  const TOTAL_PEGS = 63;

  let userIds = Object.keys(players);
  let targetPercentage = (Math.floor(targetScore / TOTAL_PEGS * 100));
  // let targetPercentage = '100';

  const scores = userIds.map((id) => {
    return (
      <ScoreBar
        key={'player-' + id}
        id={id}
        playerName={players[id].name}
        playerColorId={players[id].colorId}
        score={players[id].score}
        isWinner={id === winnerId}
        targetPercentage={targetPercentage}
      />
    )
  })

  return (
    <div id="scores" className={`${columnCount} columns`}>
      <ul>
        <li>
          <span className="score-name"></span>
          <span className="score-bar-container">
            <span className="score-target" style={{marginLeft: targetPercentage - 3 + '%'}}>
              {targetPercentage + "%"}
            </span>
          </span>
        </li>
        {scores}
      </ul>
    </div>
  )
}

ScoreList.propTypes = {
  players: PropTypes.object,
  targetScore: PropTypes.number,
  winnerId: PropTypes.string,
  columnCount: PropTypes.string,
}

export default ScoreList;
