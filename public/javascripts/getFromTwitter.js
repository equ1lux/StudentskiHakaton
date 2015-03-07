var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: 'CfQzHcv7sRa6DqklnES1nVE86',
	consumer_secret: 'zaSsfaNhJwrJry3LToWClSFAtowxemhj70hvKC76chQJ30ml6Z',
	access_token_key: '133360899-zDY4wp98jYUhkot4CvstUh3aUp7phZJeSHFutGD5',
	access_token_secret: '05ePsT3G3BpjzW5mvHz5w1kogDdJPfaAdcoC7mCrx922e'
});

$(document).ready(function() {
	$("#tweetsJson").text("ALOOOOO");
	client.get('statuses/MOFedu', params, function(error, tweets, response) {
		if (!error) {
			console.log(tweets);
			$("#tweetsJson").text("ALOOOOO");
		}
	});

});
