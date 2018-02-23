import React from 'react';

function InfoPanel({timeLeft, isPlaying, score, topScore}) {
  return (
    <section>
      <p className="m-text m-topScore">{`The current top score is: ${topScore}`}</p>
      <p className="m-text m-countdown">Time Left: {timeLeft}</p>
      <p className="m-text m-score">{isPlaying ? `${score} points` : ""}</p>
    </section>
  );
}

export default InfoPanel;