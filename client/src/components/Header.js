import React from 'react';
import SlideText from './SlideText';
import Blur from './Blur';

function Header({currentWord, text, active, isResting}) {
  return (
    <header className="m-header">
      <Blur radius={ isResting ? '5px' : '0' } transition="800ms">
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
      </Blur>
    </header>
  );
}

export default Header;