var request = require('request');
var app = require('express')();
var watson = require('./keys.js').watson;

app.listen(1337, function() {
  console.log('Watson test server listening on port 1337.');
});

var options = {
  uri: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
  auth: { 
    user: watson.user, 
    pass: watson.pass
  },
  method: 'POST',
  json: {
    text: 'Hi Team, I know the times are difficult! Our sales have been disappointing for the past three quarters for our data analytics product suite. We have a competitive data analytics product suite in the industry. But we need to do our job selling it!'
  },
  headers: {
    'Content-Type': 'application/json',
  }
};

app.get('/', (req, res) => {
  request.post(options, (err, response, body) => {
    if (err) { 
      return res.status(404).end();
    } 
    res.send(JSON.stringify(body)); 
  });
    
});
