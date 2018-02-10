import React from 'react';

function InfoPanel({timeLeft, isPlaying, score, topScore}) {
  return (
    <section>
      <p className="m-countdown">Time Left: {timeLeft}</p>
      <p className="m-score">{isPlaying ? `${score} points` : ""}</p>
      <p className="m-topScore">{`The current top score is: ${topScore}`}</p>
    </section>
  );
}

export default InfoPanel;