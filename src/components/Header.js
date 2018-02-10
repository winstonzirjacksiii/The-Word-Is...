import React from 'react';

function Header({currentWord, text}) {
  return (
    <header className="m-header">
      <h1 className="m-title">The Word Is...<span className="m-currentWord">{currentWord}</span></h1>
      <div className="m-watson-text">
        {text}
      </div>
    </header>
  );
}

export default Header;