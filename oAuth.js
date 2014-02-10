var querystring = require("querystring");
var fs = require("fs");
var http_requests = require("./http_requests");
var settings = require("./applicationsettings");
// /http://mongoosejs.com/docs/index.html
var objDb = require('mongoose');
var Schema = objDb.Schema;
var tokenSchema = new Schema(
		{
		  "session_id" : String,
		  "access_token" : String,
		  "token_type" : String,
		  "expires_in" : Number,
		  "refresh_token" : String,
		  "refresh_token_expires_in" : Number,
		  "scope" : String
		}
	);
var Token = objDb.model('Token', tokenSchema);



var requestTypes = settings.RequestTypes;
//var platformURL =	settings.platformURL;
var credentials =	settings.credentials;

var oAuthObject = {
	path: "/restapi/oauth/token",
	method: "POST"
}

var params = {
	hostname: '',
	port: '',
	path: '',
	method: requestTypes
};

function getToken(postData, params, response, session_id) {
	console.log("getToken");
	
	var authdata = {
		'grant_type'	: 'password',
		'username'		: postData.username,
		'extension'		: postData.extension,
		'password'		: postData.password
	};

	params.hostname = postData.hostname;
	var post_data = querystring.stringify(authdata);
	params.path = oAuthObject.path;
	params.method = oAuthObject.method;
	params.headers = {
		'Authorization': credentials.authHeader(),
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		'Content-Length': post_data.length
	};
	http_requests.post(params, oAuthResponseHandler, post_data, response, session_id);
}

var oAuthResponseHandler = function (res, response, session_id) {
	//console.log('STATUS: ' + res.statusCode);
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	console.log(res.statusCode);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		if (res.statusCode == 200) {
			saveTokenToDB(response, chunk, res, session_id);
		} else {
			writeResponse(response, chunk);
		}
	});
}


var getRequestAndCallHandler = function(req, response, callback, session_id) {
       		
	var body = '';
        	
	req.on('data', function (data) {
    	body += data;
    });

	req.on('end', function () {
		var postData = querystring.parse(body);
		console.log("POST Data: " + postData);
	    callback(postData, params, response, session_id);
	});
}

var saveTokenToDB = function(response, chunk, res, session_id) {
	objDb.connect('mongodb://tikhon76:lprc2711@widmore.mongohq.com:10010/PlatformTester');
	var db = objDb.connection;
	db.on('error', function callback () {
		console.log("connection error");
		writeResponse(response, chunk);
	});
	db.once('open', function callback () {
		console.log("Connected");
		var jsonToken = JSON.parse(chunk);
		jsonToken.session_id = session_id;
		console.log("Token: " + jsonToken.access_token);
		var token = new Token(jsonToken);
		token.save(function (err) {
  			if (err) {
  				console.log(err);
  			}
  			writeResponse(response, chunk);
		});
	});

}

var writeResponse = function(response, chunk) {
	response.write(fs.readFileSync("./templates/commonlinks.txt"));
	response.write("<textarea cols=\"180\" rows=\"20\">");
	response.write(chunk);
	response.write("</textarea>");
	response.end();
}

exports.oAuthObject = oAuthObject;
exports.getToken = getToken;
exports.getRequestAndCallHandler = getRequestAndCallHandler;