var crypto = require("crypto");

var generateSessionID = function() {
    var sha = crypto.createHash('sha256');
    sha.update(createGUID());
    return sha.digest('hex');
}

var createGUID = function(){
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
		});
};


exports.generateSessionID = generateSessionID;