var Twitter = require('twitter');
var request = require('request');
var http = require('http');
// var TweetTuple = require('../models/tweet');

var fileName = "./secret-config.json";
var config;
try {
  config = require(fileName);
}
catch (err) {
  config = {};
  console.log("unable to read file '" + fileName + "': ", err);
}

var twitterCreds = config.Twitter;
var accountKey = config.Wikipedia.accountKey;
var client = new Twitter({
        consumer_key: twitterCreds.consumer_key,
        consumer_secret: twitterCreds.consumer_secret,
        access_token_key: twitterCreds.access_token_key,
        access_token_secret: twitterCreds.access_token_secret
    });
     
    
function Tweet (id, user, text, score) {
    this.id = id;
    this.user = user;
    this.text = text;
    this.score = score;
    
    function setScore (score) {
        this.score = score;
    }
}

//**************************************
module.exports.list = function(req, res) 
{
    var query = req.query.query;
    getTweets(query, function(tweetArray) {
        //console.log("checking tweetArray");
        //console.log(tweetArray);
        //printTweets(tweetArray);
        res.json(tweetArray);
    });
} 
//****************************************


 
function getTweets(query, callback) {
    
    var tweetArray = [];
    
    client.get('search/tweets', { q: query }, 
    function (error, tweets, response)      //callback for client.get
    {
        //console.log(tweets);
        if (error) {
            throw error;
        };
           
        var batchScoreTweetArray = [];
             
        for (var i = 0; i < tweets["statuses"].length; i++ )
        {
            
            var tweetText = tweets["statuses"][i]["text"];
            var tweetUser = tweets["statuses"][i]["user"]["screen_name"];
            var tweet = new Tweet(i, tweetUser, tweetText, "");
            tweetArray.push(tweet);
            batchScoreTweetArray[i] = {
                "Id": i,
                "Text": tweetText
            }
            
        // for single scoring...
            // getScore(tweet, function(tweet) {
            //     //console.log(tweet);
            //     tweetArray.push(tweet);
            //      callback(tweetArray);
            //     // printTweets(tweetArray);   
            // });  

        }
        
        //console.log(batchScoreTweetArray);
        getBatchScore(tweetArray, 
            {
                "Inputs": batchScoreTweetArray
            }
        , function(tweetArray, scores) {
                scores.forEach(function(score_obj) {
                    //console.log(score.Score);
                    // console.log(tweetArray);
                    var id = score_obj.Id;
                    var score = score_obj.Score;
                    
                    if (score <0.5)
                        score += ", negative";
                    else
                        score +=", positive";
                    tweetArray[id].score = score;
                   
            });
             callback(tweetArray);  
        });
        
      
        
    });
}; //end getTweets function



/*************** REQUEST BODY ****************
{"Inputs":
[
    {"Id":"1","Text":"hello world"},
    {"Id":"2","Text":"hello foo world"},
    {"Id":"3","Text":"hello my world"},
]}
 ************************************************/

function getBatchScore(tweetArray, req_body, callback) {
    //console.log("getting batch scores");
    var url = "https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentimentBatch"

     request.post({
         url: url,
            'auth': {
                'user': 'AccountKey',
                'pass': accountKey,
                'sendImmediately': false
            },
            json: true,
            body: req_body
        }, 
        function (error, response, body) {
            //console.log(body.SentimentBatch);
            callback(tweetArray, body.SentimentBatch);
            // if (response.statusCode === 200)
            //     {
            //         console.log(response);
            //     }
            //     else
            //     {
            //         console.log(error);
            //     }  
        });
}


function getScore(tweet, callback) {
    
    var url = "https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1/GetSentiment?text=";
           
     request.get(url + tweet.tweetText, {
            'auth': {
                'user': 'AccountKey',
                'pass': accountKey,
                'sendImmediately': false
            }
        }, 
        function (error, response, body) {
            if (response.statusCode === 200)
                {
                    var cleaned = body.trim();
                    var json = JSON.parse(cleaned);  
                    tweetScore = json.Score;
                }
                else
                {
                    tweetScore = "Unable to score";
                }
                tweet.score = tweetScore;
               callback(tweet);
               
        }
    );
};



// function getScores(tweetArray) {
//     console.log("3a. getting scores");
//     tweetArray.forEach(function(tweet) {
//         //console.log(tweet.text);
//         //TODO this is all happening too late!
//         getScore(tweet.text, function(score) {
//             console.log("3b. score: " + score);
//             tweet.score = score;
//             //console.log(tweet);
//             //console.log(tweet.text);
//             console.log("3b. end of get score");
//          });
       
//      });
//      console.log("3a. end of getScores");
// }

               
               
                
// function callRes(tweetArray, res) {
//     //console.log("LAST. call res.json");
//     res.json(tweetArray);
// };



 function printTweets (tweetArray) {
     console.log("PRINTING TWEETS");
     
     tweetArray.forEach(function(tweet) {
         console.log(tweet);
     });
 };
 