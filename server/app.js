'use strict';

require('dotenv').load();
const express = require('express');
const https = require('https');

const app = express();
const twit = require('twit');
const config = require('./config');
const Twitter = twit(config);


const uri = 'eastasia.api.cognitive.microsoft.com';
const path = '/text/analytics/v2.0/sentiment';
const accessKey = process.env.SENTIMENT_ACCESS_KEY;


const get_sentiments = function (documents) {
  return new Promise((resolve, reject) => {
    const sentiment_response_handler = function (response) {

      let body = '';
      response.on('data', function (d) {
        body += d;
      });
      response.on('end', function () {
        let body_ = JSON.parse(body);
        let body__ = JSON.stringify(body_, null, '  ');
        resolve(body__);
      });
      response.on('error', function (e) {
        resolve('Error: ' + e.message);
      });
    };


    let body = JSON.stringify(documents);
    let request_params = {
      method: 'POST',
      hostname: uri,
      path: path,
      headers: {
        'Ocp-Apim-Subscription-Key': accessKey,
      }
    };

    let req = https.request(request_params, sentiment_response_handler);
    req.write(body);
    req.end();
  })
}

app.all('/*', (req, res, next) => {
  
      const allowedReferers = ['https://shashank7200.github.io/Sentimyzer/'];
  
      if(allowedReferers.indexOf(req.headers.origin) !== -1){
        res.header('Access-Control-Allow-Origin', req.headers.origin);
      }else {
        res.header('Access-Control-Allow-Origin', null);
      }
  
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,token, Access-Control-Request-Method, Access-Control-Request-Headers');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
});


app.get('/gettweets/:username', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  const username = req.params.username;
  
  Twitter.get('statuses/user_timeline', { screen_name: username, count: 10 }, function (err, data, response) {
    let documents = [];
    data.map((userdata, index) => {
      documents.push({
        id: index + 1,
        text: userdata.text
      });
    });

    get_sentiments({ documents }).then((sentiment_response_data) => res.end(sentiment_response_data) )
    .catch((error) => res.end(error));
  })
})

app.listen('8080', () => console.log("Listening on port 8080"))
