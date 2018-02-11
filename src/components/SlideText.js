import React from 'react';

function SlideText({text, isSlid}) {
  let isSlidClass = isSlid ? "is-slid" : "";

  return (
    <span className="l-relative">
      <span className="e-colorSlide--shadow">
        {text}
      </span>
      <span className={`e-colorSlide ${isSlidClass}`}>
        {text}
      </span>
    </span> 
  );
}

export default SlideText;