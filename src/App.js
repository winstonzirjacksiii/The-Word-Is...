import React, { Component } from 'react';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import ActionButtons from './components/ActionButtons';
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
        this.setState({timeLeft: this.state.timeLeft - 1 });
      } else {
        clearInterval(interval);
        this.setState({isPlaying: false});
      }
    }, 1000);

    this.nextWord();
  };

  endGame = () => {
    let {topScore, score} = this.state;
    if (score > topScore) topScore = score;

    this.stream.stop();

    this.setState({
      topScore, 
      score: 0, 
      isPlaying: false, 
      timeLeft: 0, 
      isListening: false,
      text: ""
    });
  };

  testPhrase = () => {
    if ( this.state.text.match(new RegExp("The word is " + this.state.currentWord, "gi")) ) {
      this.nextWord();
      this.setState({score: this.state.score + 1});
    }
  };

  nextWord = () => {
    this.setState({
      timeLeft: this.state.timeLeft + 2,
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
        this.stream = recognizeMic({
          token,
          objectMode: true,
          extractResults: true,
          format: false
        });

        this.setState({isListening: true});

        this.stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript
          });

          this.testPhrase();
        });

        this.stream.on('error', (err) => {
          console.log(err);
        });

        document.getElementById('stopButton').onclick = this.endGame;

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
    const {currentWord, text, timeLeft, score, topScore, isPlaying} = this.state;
    return (
      <div className="App">
        <Header currentWord={currentWord} 
                text={text} />
        <InfoPanel timeLeft={timeLeft}
                   score={score}
                   topScore={topScore}
                   isPlaying={isPlaying} />
        <section>
          <ActionButtons isListening={this.state.isListening} 
                         startPlaying={this.clickHandler} 
                         nextWord={this.nextWord} />
        </section>
      </div>
    );
  }
}

export default App;
