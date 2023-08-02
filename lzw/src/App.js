import React, { Component } from 'react';
import './App.css';

function getEncodeText() {
  var text = document.getElementById("input-textarea").value;
  var option = document.getElementById("optionEn").value;
  var dictSize = 128;
  var dict = {};
  for (var i = 0; i < dictSize; i++) {
      dict[String.fromCharCode(i)] = i;
  }

  var w = "";
  var result = [];
  for (var j = 0; j < text.length; j++) {
      var c = text.charAt(j);
      var wc = w + c;
      if (dict.hasOwnProperty(wc)) {
      // if (j == 0) {
      w = wc;
      } else {
      result.push(dict[w]);
      // Add wc to the dict.
      dict[wc] = dictSize;
      dictSize++;
      w = c;
      }
  }

  // Output the code for w.
  if (w !== "") {
      result.push(dict[w]);
  }

  if (option == "Decimal") {
      document.getElementById("output-text").innerHTML = result.join(" ");
  } else {
      var binary = [];
      for (var i = 0; i < result.length; i++) {
          binary.push(result[i].toString(2));
      }
      document.getElementById("output-text").innerHTML = binary.join(" ");
  }
}

function getDecodeText() {
  var elementText = document.getElementById("input-textarea").value;
  var text = elementText.split(' ').map(String);
  var option = document.getElementById("optionDe").value;
  if (option == "Binary") {
      for (var i = 0; i < text.length; i++) {
          text[i] = parseInt(text[i],2);
      }
  }
  var dictSize = 128;
  var dict = {};
  for (var i = 0; i < dictSize; i++) {
      dict[i] = String.fromCharCode(i);
  }
  
  var result = "";
  var w = String.fromCharCode(parseInt(text.shift()));
  result += w;

  while (text.length > 0) {
      var k = parseInt(text.shift());
      var entry;
      if (k in dict) {
      entry = dict[k];
      } else if (k === dictSize) {
          entry = w + w.charAt(0);
      } else {
          throw new Error('Bad text k: ' + k);
      }
      result += entry;
      // Add w + entry[0] to the dict.
      dict[dictSize] = w + entry.charAt(0);
      dictSize++;
      w = entry;
  }

  document.getElementById("output-text").innerHTML = result;
}

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
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
            <button type="button" className="button selector-button" onClick={getEncodeText}>Encode</button>
            <button type="button" className="button selector-button" onClick={getDecodeText}>Decode</button>
            <label htmlFor="optionDe">Input for Decode:</label>
            <select name="optionDe" id="optionDe">
              <option value="Binary">Binary</option>
              <option value="Decimal">Decimal</option>
            </select>
          </div>
        </div>
        <div className='output-form'>
          <div className="output-text" id="output-text"></div>
        </div>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
