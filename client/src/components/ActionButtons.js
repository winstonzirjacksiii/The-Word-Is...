import React from 'react';

function ActionButtons({isResting, isListening, startPlaying, nextWord}) {
  let stopOpts = {};
  if (!isListening || isResting) {
    stopOpts.disabled = 'disabled'
  }

  let opts = {};
  if (isResting) {
    opts.disabled = 'disabled'
  }

  return (
    <nav>
      {
        !isListening ?
        <button onClick={startPlaying}>Start Playing</button> :
        <button onClick={nextWord} {...opts}>Skip Word</button>
      }
      <button id="stopButton" {...stopOpts}>Stop Playing</button>
    </nav>
  )
}

export default ActionButtons;