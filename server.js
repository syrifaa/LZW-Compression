const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON request body

// This displays a message that the server is running and listening to the specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// // create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'CONNECTED' });
});

// Your dictionary and encoding/decoding logic could be moved here.
// Implement getEncodeText and getDecodeText as needed.
app.post('/encode_text', (req, res) => {
  const text = req.body.text;
  const option = req.body.option;

  var dictSize = 128;
  var dict = {};
  for (var i = 0; i < dictSize; i++) {
      dict[String.fromCharCode(i)] = i;
  }

  var w = "";
  var result = [];
  var hasil = []
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
      hasil = result.join(" ");
  } else {
      var binary = [];
      for (var i = 0; i < result.length; i++) {
          binary.push(result[i].toString(2));
      }
      hasil = binary.join(" ");
  }

  // For example, you might send back the encoded result
  const encodedText = hasil; // Replace with your actual encoded text
  res.json({ encodedText });
});

app.post('/decode_text', (req, res) => {
  const elementText = req.body.text;
  var text = elementText.split(' ').map(String);
  const option = req.body.option;

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

  // For example, you might send back the decoded result
  const decodedText = result; // Replace with your actual decoded text
  res.json({ decodedText });
});