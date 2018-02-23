import React from 'react';
import SlideText from './SlideText';
import Blur from './Blur';
import LoadingSpinner from './LoadingSpinner';

function Header({currentWord, text, active, isResting}) {
  return (
    <header className={ isResting ? "m-header e-restingBG" : "m-header"}>
      <Blur radius={ isResting ? '4px' : '0' } transition="400ms">
        <div className="m-header--content">
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
        </div>
      </Blur>
      { 
        isResting && <LoadingSpinner />
      }
    </header>
  );
}

export default Header;