
var path = require('path');
var express = require('express');
var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

// app.use(express.static(path.join(__dirname, 'views')));
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.send("Welcome to Twitter Sentiment Analyser App!");
})

app.get('/twitter-sentiment-analyser', function(req, res) {
    res.sendfile('./index.html');
});
 
app.listen(port);
console.log("Server listening on port " + port);
