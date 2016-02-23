/**
 * Author: Aron Tannenbaum
 * Version 5.something
 */



var debug = false;
var WordnikAPIKey = '0b791c592ecf07043600a0f49430ab372f1a50d59bd7a0aa7'
var request = require('request');
var wordfilter = require('wordfilter');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
var pre;
var Twit = require('twit');
var T = new Twit(require('./config.js'));

var mediaArtsSearch = {q: "#mediaarts", count: 10, result_type: "recent"}; 

Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function tweet() {
	var tweetText = pre.pick();
	
	if (debug) 
		console.log(tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function(err, reply) {
			if (err !== null) {
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}

function followAMentioner() {
	T.get('statuses/mentions_timeline', { count:50, include_rts:1 },  function (err, reply) {
		  if (err !== null) {
			console.log('Error: ', err);
		  }
		  else {
		  	var sn = reply.pick().user.screen_name;
			if (debug) 
				console.log(sn);
			else {
				T.post('friendships/create', {screen_name: sn }, function (err, reply) {
					if (err !== null) {
						console.log('Error: ', err);
					}
					else {
						console.log('Followed: ' + sn);
					}
				});
			}
		}
	});
}

function nounUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function runBot() {
	console.log(" "); 
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);	

	request(nounUrl(5000,200), function(err, response, data) {
		if (err != null) return;		
		nouns = eval(data);

		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word))
			{
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}

		pre = [
			"Who let the " + pluralize(nouns.pick().word) + " out, who who who.",
			"What do I do with my life when I have too many " + capitalize(singularize(nouns.pick().word)) + "s? What does my life mean?.", 
			"Running from an angry " + singularize(nouns.pick().word) + " worker.",
			"I'm going to drop all my classes except for " + capitalize(singularize(nouns.pick().word)) + " Studies. Take that society.",
			"Seriously, " + capitalize(singularize(nouns.pick().word)) + " women will one day rule the world.",
			"When in doubt, bring lots of " + nouns.pick().word + ".",
			"The Emperor makes us put so much work into this " + capitalize(nouns.pick().word) + " research. I should have defected to the Republic for " + capitalize(nouns.pick().word) + " instead.",
			"For the Empire! Looking forward to the " + nouns.pick().word + " Stormtrooper party.",
			"I have had it with all of these Discrete " + capitalize(nouns.pick().word) + "s!",
			"Trying to come up with names for space ships... how about the S.S. " + capitalize(singularize(nouns.pick().word)) + "? Flying through the " + capitalize(nouns.pick().word) + " System.",
			"What happened last night? Why are there so many " + pluralize(nouns.pick().word) + " here."	
		];
		

		var rand = Math.random();

 		if(rand <= 1.60) {      
			console.log("-------Tweet something");
			tweet();
			
		} else if (rand <= 0.80) {
			console.log("-------Tweet something @someone");
			respondToMention();
			
		} else {
			console.log("-------Follow someone who @-mentioned us");
			followAMentioner();
		}
	});
}

runBot();

setInterval(runBot, 1000 * 60 * 1);
