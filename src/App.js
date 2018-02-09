import React, { Component } from 'react';
import logo from './logo.svg';
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
      timeLeft: 0
    };
  }

  getWords = () => {
    fetch(`//api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=10&limit=100&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        const wordList = data.reduce((rV, x) => {
          rV.push(x.word);
          return rV;
        },[]);
        this.setState({wordList});
        this.startGame();
      }).catch((error) => {
        console.log(error);
      });
  }

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
  }

  endGame = () => {
    this.setState({isPlaying: false, timeLeft: 0});
  }

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
        });

        stream.on('error', (err) => {
          console.log(err);
        });

        document.getElementById('stopButton').onclick = () => {
          this.setState({isListening: false});
          this.endGame();
          stream.stop();
        }

        this.getWords();
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to The Word Is...</h1>
          <p>Time Left: {this.state.timeLeft}</p>
        </header>
        <section>
          {
            !this.state.isListening &&
            <button onClick={this.clickHandler}>Listen to Microphone</button>
          }
          <button id="stopButton" {...opts}>Stop Listening!</button>
          <div className="m-current-word">
            {
              this.state.isPlaying &&
              `The word is: ${this.state.currentWord}` 
            }
          </div>
          <div className="m-watson-text">
            {this.state.text}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
