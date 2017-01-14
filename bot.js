console.log('This will is the Twitter bot');


//Include the packages necessary for the twitter bot.
var Twit = require('twit');
var fs = require('fs');
var Twitter_Api_Keys = require('./twitter_api_keys');

//Declaring all variables as global for testing reasons.
var tweeting;
var tweet;
var params;
var parameters;
var mediaId;

//Create an object for twit with consumer_key, 
//consumer_secret, access_token, access_token_secret.
var Twitter = new Twit(Twitter_Api_Keys);


//Call the seachTweet function.
searchTweet();

//searchTweet is a function to search a tweet.
function searchTweet() {

    //We are declaring and initialising the parameters for the search request.
    //We can alter the parameters to match what we wish to search.
    var params = {
        q: 'mars',
        count: 2
    }

    //A get request to search for a particular tweet or keyword in a tweet.
    Twitter.get('search/tweets', params, gotData);

    //gotData is the search request callback function.
    function gotData(err, data, response) {

        //Check for error.
        if(err) {
            console.log("Error Ocurred!");
        }   else{
            var tweets = data.statuses;
            //Print all the tweet text in the response.
            for(var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
            }
        }
    }
}


//This is Setting up a user stream.
//We will use this user stream to check if someone followed the bot 
//and to see if there are any @mentions in the bot's name.
var stream = Twitter.stream('user');


//Call the followBot function.
followBot();

//followBot function sends a tweet to anyone who follows the Bot.
function followBot() {

    //The followed function is invoked whenever you are followed.
    //Constantly monitors if you are being followed in twitter.
    stream.on('follow', followed);

    //followed function is run everytime you are followed.
    //We get the details about the follower using the callback data 
    //and we send them a message.
    function followed(event) {
        console.log("Follow Event fired!");
        var name = event.source.name;
        var accountName = event.source.screen_name;
        tweetThis('.@' + accountName + ' How you doing?');
    }
}


//Call the mentionBot function.
mentionBot();

//mentionBot is responsible for checking if someone @mentions it and
//it saves that info in a file instead of the command line because that would be shabby.
function mentionBot() {

    //The mentioned function is invoked whenever you are mentioned.
    //Constantly monitors if you are being mentioned in twitter.
    stream.on('tweet', mentioned);

    //mentioned function is run everytime you are mentioned.
    //We get the details about the mentioner using the callback data 
    //and store their info in a file.
    function mentioned(event) {
        //Convert the data into JSON type before writing into a file.
        var json = JSON.stringify(event, null, 2);
        //Write the mentioner's info into a file tweet.json Synchronously.
        fs.writeFileSync("tweet.json", json);

        //Call the replier bot function.
        replierBot();

        //replierBot function replies to the @mentioner.
        function replierBot() {

            //@mentioner and @mentionee.
            var tweetTo = event.in_reply_to_screen_name;
            var tweetFrom = event.user.screen_name;
            
            console.log('To: ' + tweetTo + ' From: ' + tweetFrom);

            //Tweet the @mentioner this message.
            //Check to see if they mentioned the bot in their tweet.
            if(tweetTo === 'a2zBot') {
                
                tweetThis('@' + tweetFrom + 'Thank you for tweeting me.');
            }

        }
    }
}


//Call to the tweetThis function.
tweetThis('Hello World!!');

//tweetThis is a generic function that tweets.
function tweetThis(msg) {

    //We are declaring and initialising the parameters for the update status request.
    //We can alter the parameters to match what we wish to update / tweet.
    var tweet = { 
        //Status must be within 140 Characters.
        status: msg
    }

    //A post request to handle a status update in twitter.
    Twitter.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {

        //Check for error.
        if(err)  {
            console.log("Error Ocurred!");
        }   else    {
            console.log(data.created_at, data.text);
        }
    }
}


//Call the tweetIt function.
tweetIt();

//tweetIt is a generic function that tweets.
function tweetIt() {

    //To read the image file using the node package FileSystem.
    var filename = 'images/image_to_upload.png';
    //An image with base64 encoding.
    // Alter the parameters to suit your needs
    var parameters = {
        encoding: 'base64'
    }
    var base64content = fs.readFileSync(filename, parameters);

    //Here we are uploading the image / media file using base64 encoding.
    //Once the media file is uploaded, the uploaded callback is invoked. 
    Twitter.post('media/upload', {media_data: base64content}, uploaded);

    function uploaded(err, data, response) {

        //Save the media_id_string for furthur use.
        var mediaId = data.media_id_string;

        //We are declaring and initialising the parameters for the update status request.
        //We can alter the parameters to match what we wish to update / tweet.
        var tweeting = { 
            //Status must be within 140 Characters.
            status: '#codingtwitterbot using node.js and twit package',
            //This adds the media file to the post request queue. 
            media_ids: [mediaId]
        }

        //A post request to handle a status update in twitter.
        Twitter.post('statuses/update', tweeting, tweeted);

        function tweeted(err, data, response) {

            //Check for error.
            if(err)  {
                console.log(err);
            }   else    {
                console.log(data.created_at, data.text);
            }
        }
    }
}
