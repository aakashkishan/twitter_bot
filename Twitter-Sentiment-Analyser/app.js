
var path = require('path');
var sentiment = require('sentiment');
var express = require('express');
var app = express();

var port = (process.env.VCAP_APP_PORT || 3000);

var analysis;

// app.use(express.static(path.join(__dirname, 'views')));
// app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.send("Welcome to Twitter Sentiment Analyser App!");
})

app.get('/twitter-sentiment-analyser', function(request, response) {

    var query = request.query.analyse_text;
    if (!query) {
        response.render('./index.jade');
    } else {
        sentiment(query, function (error, result) {
            analysis = "Sentiment of " + query + " is " + result.score ;
            response.render('./analysis.jade', {result: analysis});
        })
    }
});
 
app.listen(port);
console.log("Server listening on port " + port);
