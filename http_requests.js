var http = require("http");

var RequestTypes = {
	GET:	'GET',
	POST:	'POST',
	PUT:	'PUT',
	DELETE:	'DELETE'
}
	

function get(params, responseHandler) {
	console.log("GET Request: " + params);
	var req = http.request(params, function(res) {
		responseHandler(res);
	});
	req.end();
}

function post(params, responseHandler, postData, response) {
	console.log("POST Request: " + postData);
	var req = http.request(params, function(res) {
		responseHandler(res, response);
	});
	
	// post the data
	req.write(postData);
	req.end();
}

exports.get = get;
exports.post = post;
exports.RequestTypes = RequestTypes;
















//example
var options = {
	hostname: "www.ya.ru",
	port: 80,
	path: '',
	method: 'GET'
};
function gett() {
	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
	 	});
	});
	req.end();
}