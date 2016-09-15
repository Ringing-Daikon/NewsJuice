const request = require('request');
const auth = require('../../keys.js').watson;

const uri = 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19';
const method = 'POST';
const headers = {
  'Content-Type': 'application/json'
};

module.exports = {
  // expects req.body to be an object { text: 'text here' }
  analyze: (req, res) => {
    const json = req.body;
    const options = {uri, auth, method, headers, json};
    request.post(options, (err, response, body) => {
      if (err) { 
        return res.status(404).send('Not found!');
      } 
      res.status(200).send(body); 
    });
  }
};