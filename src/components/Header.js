import React from 'react';
import SlideText from './SlideText';

function Header({currentWord, text, active}) {
  return (
    <header className="m-header">
      <h1 className="m-title">
        <SlideText text="The Word Is" isSlid={active.phrase} />
        { !currentWord ? 
          "..." :
          <span className="m-currentWord">
            <SlideText text={currentWord} isSlid={active.current} />
          </span>
        }
      </h1>
      <div className="m-watson-text">
        {text}
      </div>
    </header>
  );
}

export default Header;