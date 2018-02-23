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
        <button aria-label="Start" className="m-btn i-play" onClick={startPlaying}></button> :
        <button aria-label="Next Word" className="m-btn i-fast-fw" onClick={nextWord} {...opts}></button>
      }
      <button aria-label="Stop" className="m-btn i-stop" id="stopButton" {...stopOpts}></button>
    </nav>
  )
}

export default ActionButtons;