
const express = require('express');
const OAuth = require('OAuth'); // https://github.com/ciaranj/node-oauth
const fs = require('fs');
const app = express();

//--- open web server

app.listen(3000, function () {
	console.log('server listening on port 3000');
});

// you can get it at api dev site at
// http://developer.trademe.co.nz/api-overview/authentication/

var TradeMeKey = process.env.TradeMeKey;
var TradeMeSecret = process.env.TradeMeSecret;
var TradeMe_token = process.env.TradeMe_token;
var TradeMe_secret = process.env.TradeMe_secret;


// http://www.tmsandbox.co.nz/
// https://secure.trademe.co.nz/Oauth/RequestToken
// https://secure.trademe.co.nz/Oauth/Authorize
// https://secure.trademe.co.nz/Oauth/AccessToken

var oauth = new OAuth.OAuth(
	'http://www.tmsandbox.co.nz/Oauth/RequestToken',
	'http://www.tmsandbox.co.nz/Oauth/AccessToken',
	TradeMeKey,									// API key
	TradeMeSecret,							// API secret
	'1.0',
	null,												// callback - null = oob
	'HMAC-SHA1'
);

// 	'https://api.tmsandbox.co.nz/v1/MyTradeMe/Watchlist/All.json',
//	'https://api.tmsandbox.co.nz/v1/Categories.xml ',

oauth.get(
	'https://api.tmsandbox.co.nz/v1/Search/General.JSON?search_string=ram',
	TradeMe_token,
	TradeMe_secret,

	function (error, data, response){   // not looking at the responce
		if (error) console.error(error);

		var file = 'cat.json';
		fs.writeFile(file, data, function(err) {
			if(err) {
				return console.log(err);
			}

			console.log('The file was saved!');
		});


		var jsonData = JSON.parse(data);
		//console.log(JSON.stringify(data, 0, 2));
		//console.log(response);
		//console.log(data);

		console.log('total found ' + jsonData.TotalCount);
		console.log(jsonData.List[0].Title);
		console.log(jsonData.List[1].Title);
		console.log('--------------------------------------');
		//console.log(response);

		var webtext = 'total found ' + jsonData.TotalCount;
		webtext += '<br>' + jsonData.List[0].Title;
		webtext += '<br>' + jsonData.List[1].Title;

		app.get('/', function (req, res) {
			res
				//.code(200)
				//	.header('Content-Type', 'text/html')
				//.type('text/html')
				.send(webtext);
		});

	});

