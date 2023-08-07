import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    data: null,
    outputText: '',
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  handleEncodeText = async () => {
    const inputText = document.getElementById("input-textarea").value;
    const option = document.getElementById("optionEn").value;

    const response = await fetch('/encode_text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        option: option,
      }),
    });

    const data = await response.json();
    this.setState({ outputText: data.encodedText });
  };

  handleDecodeText = async () => {
    const inputText = document.getElementById("input-textarea").value;
    const option = document.getElementById("optionDe").value;

    const response = await fetch('/decode_text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        option: option,
      }),
    });

    const data = await response.json();
    this.setState({ outputText: data.decodedText });
  };

  render() {
    return (
      <div className='App'>
        <div className='input-form'>
          <textarea type="text" className="input-textarea" id="input-textarea" placeholder="Input text here"></textarea>
          <div className="selector">
            <label htmlFor="optionEn">Output for Encode:</label>
            <select name="optionEn" id="optionEn">
              <option value="Binary">Binary</option>
              <option value="Decimal">Decimal</option>
            </select>
            <button type="button" className="button selector-button" onClick={this.handleEncodeText}>Encode</button>
            <button type="button" className="button selector-button" onClick={this.handleDecodeText}>Decode</button>
            <label htmlFor="optionDe">Input for Decode:</label>
            <select name="optionDe" id="optionDe">
              <option value="Binary">Binary</option>
              <option value="Decimal">Decimal</option>
            </select>
          </div>
        </div>
        <div className='output-form'>
          <div className="output-text" id="output-text">{this.state.outputText}</div>
        </div>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;