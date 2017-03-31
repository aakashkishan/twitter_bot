
var path = require('path');
var sentiment = require('sentiment');
var Twit = require('twit');
var express = require('express');
var app = express();


//Include the Twitter API Keys.
var twitter_api_keys = require('./twitter_api_keys');
var tweeter = new Twit(twitter_api_keys);

var port = (process.env.VCAP_APP_PORT || 4000);

var analysis;

// app.use(express.static(path.join(__dirname, 'views')));
// app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(request, response) {

        if (response.statusCode == 200) {
            var greeting = "Welcome Mr./Ms. User";
            response.render('./success.jade', {message: greeting});
        } else {
            response.render('./error.jade');
        }
});

app.get('/sentiment-analyser', function(request, response) {
    
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
 
app.get('/twitter-sentiment-analyser', function (request, response) {
    var testTweetCount;
    var phrase = 'bieber';
    var stream = tweeter.stream('statuses/filter', {
        'track': phrase
    }, function (stream) {
        response.render("./error.jade");
        stream.on('data', function (data) {
            testTweetCount++;
            // Update the console every 50 analyzed tweets
            if (testTweetCount % 50 === 0) {
                console.log("Tweet #" + testTweetCount + ":  " + data.text);
            }
        });
    });
    // response.send("Hello");
});

app.listen(port, function() {
    console.log("Listening at port: " + port);
});
