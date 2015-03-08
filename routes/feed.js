var express = require('express');
var router = express.Router();

var Twitter = require('twitter');
var params = {
  screen_name: 'MOFedu'
};
var client = new Twitter({
  consumer_key: 'CfQzHcv7sRa6DqklnES1nVE86',
  consumer_secret: 'zaSsfaNhJwrJry3LToWClSFAtowxemhj70hvKC76chQJ30ml6Z',
  access_token_key: '133360899-zDY4wp98jYUhkot4CvstUh3aUp7phZJeSHFutGD5',
  access_token_secret: '05ePsT3G3BpjzW5mvHz5w1kogDdJPfaAdcoC7mCrx922e'
});

client.get('statuses/user_timeline', params, function(error, tweets, response) {

  if (!error) {
    parseJSON(tweets);
  }
});

function parseJSON(tweets)
{
  var tweetCreatedAt;
  var tweetText;
  var tweetUserName;
  var tweetFollowersCount;
  var tweetStatusesCount;
  var tweetProfileImageURL;
  var tweetHashTags = [];
  var tweetFavouriteCount;
  var tweetRetweetedCount;

  for (var i in tweets) {
    tweetCreatedAt = tweets[i]['created_at'];

    tweetText =  tweets[i]['text'];
    tweetUserName = tweets[i]['user']['name'];
    tweetFollowersCount = tweets[i]['user']['followers_count'];
    tweetStatusesCount = tweets[i]['user']['statuses_count'];
    tweetProfileImageURL = tweets[i]['user']['profile_image_url'];

    tweetFavouriteCount = tweets[i]['favorite_count'];
    tweetRetweetedCount = tweets[i]['retweet_count'];

    tweetHashTags = [];
     for (var j in tweets[i]['entities']['hashtags']) {
      tweetHashTags.push(tweets[i]['entities']['hashtags'][j]['text']);
     }

     console.log(tweetHashTags);
  }


}

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
  var db = req.db;
  db.collection('userlist').find().toArray(function(err, items) {
    res.json(items);
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
        msg: err
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
