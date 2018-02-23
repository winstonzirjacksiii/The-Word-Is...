import React, { Component } from 'react';
import Header from './components/Header';
import InfoPanel from './components/InfoPanel';
import ActionButtons from './components/ActionButtons';
import { getWord } from './modules/wordlist';

import './css/App.css';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

let apiRoot = ""
// let apiRoot = "//localhost:3002"

const initialActiveState = {
  "phrase": false, 
  "current": false
};

const initialState = {
  text: "",
  isListening: false,
  isPlaying: false,
  isResting: false,
  wordList: [],
  currentWord: "",
  score: 0,
  topScore: 0,
  timeLeft: 0,
  active: initialActiveState
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  getWordsWordnik = () => {
    return new Promise( (resolve, reject) => {
      fetch(`//api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=1&minLength=3&maxLength=6&limit=100&api_key=5dea0ac0206bd920cd1dc37eead1dfa3d485815cfbd8344a5`)
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
        this.endGame();
      }
    }, 1000);

    this.nextWord();
  };

  endGame = () => {
    let {topScore, score} = this.state;
    if (score > topScore) topScore = score;

    this.stream.stop();

    this.setState({
      ...initialState,
      topScore, 
    });
  };

  testPhrase = () => {
    let { text, active, currentWord } = this.state;
    active.phrase = text.match(new RegExp("the word is", "gi")) ? true : false;
    active.current = text.match(new RegExp(currentWord, "gi")) ? true : false;

    this.setState({
      active: {
        "phrase": active.phrase,
        "current": active.current
      }
    });

    if ( active.phrase && active.current ) {
      this.setState({
        score: this.state.score + 1,
        timeLeft: this.state.timeLeft + 2
      });
      this.nextWord();
    }
  };

  nextWordWordnik = () => {
    if (!this.state.isResting) {
      this.setState({isResting:true});

      setTimeout((function resolveNewWordTimeout(){
        this.setState({
          currentWord: this.state.wordList[0],
          wordList: this.state.wordList.slice(1),
          text: "",
          active: initialActiveState,
          isResting:false
        });
      }).bind(this), 2000);
    }
  };

  nextWord = () => {
    if (!this.state.isResting) {
      this.setState({isResting:true});

      setTimeout((function resolveNewWordTimeout(){
        this.setState({
          currentWord: getWord(),
          text: "",
          active: initialActiveState,
          isResting:false
        });
      }).bind(this), 2000);
    }
  };

  clickHandler = () => {
    fetch(apiRoot + '/api/speech-to-text/token')
      .then((response) => {
        return response.text();
      }).then((token) => {
        this.stream = recognizeMic({
          token,
          objectMode: true,
          extractResults: true,
          format: false
        });

        this.setState({isListening: true});

        this.stream.on('data', (data) => {
          if (!this.state.isResting) { 
            this.setState({
              text: data.alternatives[0].transcript
            });
            this.testPhrase();
          }
        });

        this.stream.on('error', (err) => {
          console.log(err);
        });

        document.getElementById('stopButton').onclick = this.endGame;
        this.startGame();
      }).catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {currentWord, text, timeLeft, score, topScore, isPlaying, active, isListening, isResting} = this.state;
    return (
      <div className="App">
        <Header currentWord={currentWord} 
                text={text}
                active={active}
                isResting={isResting} />
        <InfoPanel timeLeft={timeLeft}
                   score={score}
                   topScore={topScore}
                   isPlaying={isPlaying} />
        <section>
          <ActionButtons isResting={isResting}
                         isListening={isListening} 
                         startPlaying={this.clickHandler} 
                         nextWord={this.nextWord} />
        </section>
      </div>
    );
  }
}

export default App;
