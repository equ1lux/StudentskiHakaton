var express = require('express');
var router = express.Router();
//*MongoDB
var mongo = require('mongoskin');
var db = mongo.db(
  "mongodb://mirzamaznikar:0123456789@ds053251.mongolab.com:53251/hakmof");


var Twitter = require('twitter');
var params = {
  screen_name: 'equ1lux',
};
var client = new Twitter({
  consumer_key: 'CfQzHcv7sRa6DqklnES1nVE86',
  consumer_secret: 'zaSsfaNhJwrJry3LToWClSFAtowxemhj70hvKC76chQJ30ml6Z',
  access_token_key: '133360899-zDY4wp98jYUhkot4CvstUh3aUp7phZJeSHFutGD5',
  access_token_secret: '05ePsT3G3BpjzW5mvHz5w1kogDdJPfaAdcoC7mCrx922e'
});

client.get('statuses/user_timeline', params, function(error, tweets, response) {

  if (!error) {
    //console.log("twitterStream " + JSON.stringify(tweets[0]));
    //parseJSON(tweets[0]);
  }
});
var tmp = 0;
client.stream('user', function(stream) {
  stream.on('data', function(tweet) {
    tmp = tmp + 1;
    //console.log("twitterStream " + tmp + " " + JSON.stringify(tweet));
    if (tmp > 1) {
      parseJSON(tweet);
    }
  });

  stream.on('error', function(error) {
    //console.log(error);
  });
});



function parseJSON(tweets) {
  var tweetCreatedAt;
  var tweetText;
  var tweetUserName;
  var tweetFollowersCount;
  var tweetStatusesCount;
  var tweetProfileImageURL;
  var tweetHashTags = [];
  var tweetFavouriteCount;
  var tweetRetweetedCount;
  tweetCreatedAt = tweets['created_at'];

  tweetText = tweets['text'];
  tweetUserName = tweets['user']['name'];
  tweetFollowersCount = tweets['user']['followers_count'];
  tweetStatusesCount = tweets['user']['statuses_count'];
  tweetProfileImageURL = tweets['user']['profile_image_url'];

  tweetFavouriteCount = tweets['favorite_count'];
  tweetRetweetedCount = tweets['retweet_count'];

  tweetHashTags = [];
  for (var j in tweets['entities']['hashtags']) {
    console.log("tags " + tweetHashTags.push(tweets['entities']['hashtags'][j]
      ['text']));
  }
  var row = [tweetCreatedAt, tweetText, tweetUserName,
    tweetFollowersCounttweetStatusesCount, tweetProfileImageURL,
    tweetFavouriteCount, tweetRetweetedCount, tweetHashTags
  ];
  console.log(JSON.stringify(row));
  db.collection('scraped_twitter').insert("aloo", function(err, result) {
    res.send(
      (err === null) ? {
        msg: ''
      } : {
        msg: JSON.stringify(err)
      }
    );
  });
}


/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
  var db = req.db;
  db.collection('scraped_data').find().toArray(function(err, items) {
    console.log("log " + res.json(items));
  });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  var db = req.db;
  db.collection('userlist').insert(req.body, function(err, result) {
    res.send(
      (err === null) ? {
        msg: ''
      } : {
        msg: JSON.stringify(err)
      }
    );
  });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var userToDelete = req.params.id;
  db.collection('userlist').removeById(userToDelete, function(err, result) {
    res.send((result === 1) ? {
      msg: ''
    } : {
      msg: 'error: ' + err
    });
  });
});



module.exports = router;
