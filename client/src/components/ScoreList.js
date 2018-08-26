import React from 'react';
import PropTypes from 'prop-types';

import ScoreBar from './ScoreBar';

const ScoreList = ({ userId, players, targetScore, winnerId, columnCount }) => {
  const TOTAL_PEGS = 63;

  let userIds = Object.keys(players);
  let targetPercentage = (Math.floor(targetScore / TOTAL_PEGS * 100));

  const scores = userIds.map((id) => {
    return (
      <ScoreBar
        key={'player-' + id}
        playerName={players[id].name}
        playerId={players[id].playerId}
        score={players[id].score}
        isThisPlayer={id === userId}
        isWinner={players[id].playerId === winnerId}
        targetPercentage={targetPercentage}
      />
    )
  })

  return (
    <div id="scores" className={``}>
      <ul>
        <li>
          <span className="score-name"></span>
          <span className="score-bar-container">
            {/* subtract 3 to center text above the target line */}
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
