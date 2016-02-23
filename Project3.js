// Our Twitter library
var Twit = require('twit');
var pre;

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var successSearch = {q: "#MoreSuccessfulThanObamacare", count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', successSearch, function (error, data) {
	  // If our search request to the server had no errors...
console.log(error, data);
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}



/*
request(nounUrl(5000,200), function(err, response, data) {
		if (err != null) return;		// bail if no data
		nouns = eval(data);

		// Filter out the bad nouns via the wordfilter
		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word))
			{
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}
pre = [
			"Oh my god, I haven't even started this essay on " + pluralize(nouns.pick().word) + " yet.",
			"I don't know how anybody can tolerate Prof. " + capitalize(singularize(nouns.pick().word)) + ". What a tool.", 
			"I'm so behind in my " + singularize(nouns.pick().word) + " class.",
			"I'm thinking of changing my major to " + capitalize(singularize(nouns.pick().word)) + " Studies.",
			"Seriously, " + capitalize(singularize(nouns.pick().word)) + " Engineering is ruining my life.",
			"I can't believe I forgot to bring my " + nouns.pick().word + " to lab again.",
			"Sooo much homework in this " + capitalize(nouns.pick().word) + " class. I should have taken " + capitalize(nouns.pick().word) + " instead.",
			"Almost the weekend! Totally amped for the " + nouns.pick().word + " party.",
			"Seriously I have had enough of Intro to " + capitalize(nouns.pick().word) + ".",
			"Who's coming to Club " + capitalize(singularize(nouns.pick().word)) + " tonight? I'm DJing along with my bro " + capitalize(nouns.pick().word) + ".",
			"Missed class again. Too many " + pluralize(nouns.pick().word) + " last night."
			// etc.			
		];*/

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 1);
