import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      isListening: false
    };
  }

  listenHandler = () => {
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
          stream.stop();
        }
      }).catch((error) => {
        console.log(error);
      })
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
          <p>There will be more to come. We promise!</p>
        </header>
        <section>
          {
            !this.state.isListening &&
            <button onClick={this.listenHandler}>Listen to Microphone</button>
          }
          <button id="stopButton" {...opts}>Stop Listening!</button>

          <div className="m-watson-text">
            {this.state.text}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
