var querystring = require("querystring");
var fs = require("fs");
var http_requests = require("./http_requests");
var settings = require("./applicationsettings");
var objDb = require('mongoose');


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

function getToken(postData, params, response) {
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
	http_requests.post(params, oAuthResponseHandler, post_data, response);
}

var oAuthResponseHandler = function (res, response) {
	//console.log('STATUS: ' + res.statusCode);
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	console.log(res.statusCode);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		if (res.statusCode == 200) {
			saveTokenToDB(response, chunk, res);
		} else {
			response.write("Failed. Response Status: " + res.statusCode);
		}

	});
}


var getRequestAndCallHandler = function(req, callback, response) {
       		
	var body = '';
        	
	req.on('data', function (data) {
    	body += data;
    });

	req.on('end', function () {
		var postData = querystring.parse(body);
		console.log("POST Data: " + postData);
	    callback(postData, params, response);
	});
}

var saveTokenToDB = function(response, chunk, res) {
	objDb.connect('mongodb://tikhon76:lprc2711@widmore.mongohq.com:10010/PlatformTester');
	var db = objDb.connection;
	db.on('error', function callback () {
		console.log("connection error");
		writeResponse(response, chunk);
	});
	db.once('open', function callback () {
		console.log("Connected");
		writeResponse(response, chunk);
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