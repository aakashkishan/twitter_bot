var port = (process.env.VCAP_APP_PORT || 5000);
var express = require("express");
var sentiment = require('sentiment');
 
var app = express();
 
var twitter = require('ntwitter');
 
var twit = new twitter({
  consumer_key:         'sDXkdM8mK3i55VqHfmZz53l5c',
  consumer_secret:      'hL80DEBzb9nXH0XtioG8ZooRQQztBTRG8b3HMvJj4GAdIQco6F',
  access_token:         '819834118972338176-mhwwAKaidDmvaZXZtIXEBc4uKCz30Gt',
  access_token_secret:  'nC83yMdKIVGhgaokUY9BwbgOf7TMFnfaqthNfcpnsHXti',
});

twit
  .verifyCredentials(function (err, data) {
    console.log(data);
  });

app.listen(port);
console.log("Server listening on port " + port);