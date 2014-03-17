var http = require("http");
var url = require("url");
var querystring = require("querystring");
var http_requests = require("./http_requests");
var router = require("./router");
var oAuth = require("./oAuth");
var fs = require("fs");
var sessions = require("./sessions");
var common = require("./common");

var tokens = {
	"access_token" : "",
  	"refresh_token" : ""
}





function start() {
	function onRequest(request, response) {

		var sessionID = "";
		var commands = router.commands;
		var RequestTypes =	http_requests.RequestTypes;
		var path = "";
		var method = "";
		var parsedUrl = url.parse(request.url);
		var cookeis = http_requests.parseCookies(request);
		if (cookeis.sessionID == "" || cookeis.sessionID == null) {
			sessionID = sessions.generateSessionID();
		} else {
			sessionID = cookeis.sessionID;
		}
		
		console.log("Cookies:" + JSON.stringify(cookeis));

		response.writeHead(200, 
			{
				'Set-Cookie': 'sessionID=' + sessionID,
				"Content-Type": "text/html"
			}
		);
		path = parsedUrl.pathname.substring(1);
		method = request.method;
		

		if (path != "") {
			console.log("Path: " + path + ", Method: " + method);
			switch (path) {
				case commands.OAuth:
					switch (method) {
						case RequestTypes.POST:
							oAuth.getRequestAndCallHandler(request, response, oAuth.getToken, sessionID);
							break;
						case RequestTypes.GET:
							response.write(fs.readFileSync("./templates/" + path + ".html"));
							response.end();
							break;
						default:
							console.log("Disallowed request method for:" + path + ". Expected GET, POST, received " + method);
							response.end();
					}
					break;
				case commands.Messages:
					switch (method) {
						case RequestTypes.POST:
						
						break;
						case RequestTypes.GET:
							response.write(fs.readFileSync("./templates/" + path + ".html"));
							response.end();
							break;
						default:
							console.log("Disallowed request method for:" + path + ". Expected GET, POST, received " + method);
							response.end();
					}
					break;
				default:
					console.log("Unknown path: " + path);
					response.end();
			}
			
		} else {
			response.write(fs.readFileSync("./templates/index.html"));
			response.end();
		}
		
		//====================functions=================
		//was here:
		// responseHandler()
		//getRequestAndCallHandler


	}

	http.createServer(onRequest).listen(2000);
	setInterval(someJob, 60000);
	console.log("Server started at port 2000");
}

function someJob() {
	console.log("Some Job: " + common.getFormattedTime());
}

exports.start = start;






/*

var params = {
	hostname: platformURL.hostname,
	port: platformURL.port,
	path: '',
	method: RequestTypes.GET
};

		function responseHandler(res) {
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			console.log(res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				response.write(chunk);
			});
			res.on('close', function() {
				console.log("request close");
				response.end();
			});
			res.on('end', function() {
				console.log("request end");
				response.end();
			});
		}

		function getRequestAndCallHandler(req, callback) {
       		
       		var body = '';
        	
        	request.on('data', function (data) {
        	    body += data;
    	    });

	        request.on('end', function () {
	            var postData = querystring.parse(body);
				console.log("POST Data: " + postData);
	            callback(postData, params, response);
	        });
		}

*/