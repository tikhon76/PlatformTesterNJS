//Android keys
var applicationKey = "XUFGgqWrYwBdQUZ37czJUl1BRkYvDUdEXUFGVy8Nz0Q";
var applicationSecret = "XUCBNtu2-HVdQIFrWZQUZF1AgXXY9OBvXUCBitrTGG9dQIGUV3PsAl1AgadXcnQCXUCBtldy_AJdQIHDrBFT2Q";

//IPhone Keys
//string applicationKey = "3ffb3e18dd58d15a96520baf753f0b79";
//string applicationSecret = "3299d45894e568989e965e1b1990e692";

var platformURL = {
	hostname:  '',
	port: '',
	url: function (){
		return this.hostname + ':' + this.port;
	}
};

var credentials = {
	applicationKey: applicationKey,
	applicationSecret: applicationSecret,
	authHeader: function (){
		var b64 = new Buffer(this.applicationKey + ":" + this.applicationSecret).toString('base64');
		return "Basic " + b64;
	}
};

exports.platformURL = platformURL;
exports.credentials = credentials;