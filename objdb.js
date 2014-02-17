// /http://mongoosejs.com/docs/index.html
var objDb = require('mongoose');
var Schema = objDb.Schema;



// Session related data
var sessionSchema = new Schema(
		{
			"timestamp" : Number,
			"session_id" : String,
			"last_activity" : Number
		}
	);
var Session = objDb.model('Session', sessionSchema);

var saveSessionToDB = function() {
	
}



// Token related code
var tokenSchema = new Schema(
		{
		  "timestamp" : Number,
		  "session_id" : String,
		  "access_token" : String,
		  "token_type" : String,
		  "expires_in" : Number,
		  "refresh_token" : String,
		  "refresh_token_expires_in" : Number,
		  "scope" : String,
		  "access_token_expires": Number,
		  "refresh_token_expires": Number
		}
	);
var Token = objDb.model('Token', tokenSchema);

var saveTokenToDB = function(response, responseText, res, session_id, callback) {
	objDb.connect('mongodb://tikhon76:lprc2711@widmore.mongohq.com:10010/PlatformTester');
	var db = objDb.connection;
	db.on('error', function callback () {
		console.log("connection error");
		callback(response, responseText);
	});
	db.once('open', function openCallBack () {
		console.log("Mongo Connected");
		var jsonToken = JSON.parse(responseText);
		var currDate = (new Date()).getTime();
		jsonToken.timestamp = currDate;
		jsonToken.session_id = session_id;
		jsonToken.access_token_expires = currDate + jsonToken.expires_in * 1000;
		jsonToken.refresh_token_expires = currDate + jsonToken.refresh_token_expires_in * 1000;
		var token = new Token(jsonToken);
		token.save(function (err) {
  			if (err) {
  				console.log(err);
  			}
  			callback(response, responseText);
		});
	});
}



// Exports
exports.saveTokenToDB = saveTokenToDB;