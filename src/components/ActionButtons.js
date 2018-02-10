import React from 'react';

function ActionButtons({isListening, startPlaying, nextWord}) {
  let opts = {};
  if (!isListening) {
    opts.disabled = 'disabled'
  }
  
  return (
    <nav>
      {
        !isListening ?
        <button onClick={startPlaying}>Start Playing</button> :
        <button onClick={nextWord}>Skip Word</button>
      }
      <button id="stopButton" {...opts}>Stop Playing</button>
    </nav>
  )
}

export default ActionButtons;