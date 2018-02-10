import React, { Component } from 'react';
import './App.css';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      isListening: false,
      isPlaying: false,
      wordList: [],
      currentWord: "",
      score: 0,
      topScore: 0,
      timeLeft: 0
    };
  }

  getWords = () => {
    return new Promise( (resolve, reject) => {
      fetch(`//api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=6&limit=100&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        const wordList = data.reduce((rV, x) => {
          rV.push(x.word);
          return rV;
        },[]);
        resolve(wordList);
      }).catch((error) => {
        console.log(error);
      });
    });
  };

  startGame = () => {
    this.setState({isPlaying: true, timeLeft:60 });

    const interval = setInterval(() => {
      if (this.state.timeLeft > 0) {
        this.setState({timeLeft: this.state.timeLeft -1 });
      } else {
        clearInterval(interval);
        this.setState({isPlaying: false});
      }
    }, 1000);

    this.nextWord();
  };

  endGame = () => {
    this.setState({isPlaying: false, timeLeft: 0});
  };

  testPhrase = () => {
    if ( this.state.text.match(new RegExp("The word is " + this.state.currentWord, "gi")) ) {
      this.nextWord();
      this.setState({score: this.state.score + 1});
    }
  };

  nextWord = () => {
    this.setState({
      currentWord: this.state.wordList[0],
      wordList: this.state.wordList.slice(1)
    });
  }

  clickHandler = () => {
    fetch('//localhost:3002/api/speech-to-text/token')
      .then((response) => {
        return response.text();
      }).then((token) => {
        console.log("got a token:", token);
        let stream = recognizeMic({
          token,
          objectMode: true,
          extractResults: true,
          format: false
        });

        this.setState({isListening: true});

        stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript
          });

          this.testPhrase();
        });

        stream.on('error', (err) => {
          console.log(err);
        });

        document.getElementById('stopButton').onclick = () => {
          this.setState({isListening: false});
          this.endGame();
          stream.stop();
        }

        this.getWords()
        .then((wordList) => {
          this.setState({wordList});
          this.startGame();
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  render() {
    let opts = {};
    if (!this.state.isListening) {
      opts.disabled = 'disabled'
    }

    return (
      <div className="App">
        <header className="m-header">
          <h1 className="m-title">The Word Is...<span className="m-currentWord">{this.state.currentWord}</span></h1>
        </header>
        <section>
          <p className="m-countdown">Time Left: {this.state.timeLeft}</p>
          <p className="m-score">{this.state.isPlaying ? `${this.state.score} points` : ""}</p>
        </section>
        <section>
          <nav>
            {
              !this.state.isListening ?
              <button onClick={this.clickHandler}>Start Playing</button> :
              <button onClick={this.nextWord}>Skip Word</button>
            }
          </nav>
          <button id="stopButton" {...opts}>Stop Playing</button>
          <div className="m-watson-text">
            {this.state.text}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
