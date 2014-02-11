var querystring = require("querystring");
var fs = require("fs");
var http_requests = require("./http_requests");
var settings = require("./applicationsettings");
var objDB = require("./objdb");



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
	res.on('data', function (responseText) {
		if (res.statusCode == 200) {
			objDB.saveTokenToDB(response, responseText, res, session_id, writeResponse);
		} else {
			writeResponse(response, responseText);
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