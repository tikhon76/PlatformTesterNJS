var getFormattedTime = function () {
	var currentDate = new Date();
	var strDate = currentDate.getUTCFullYear();
	strDate += "-" + addZero(currentDate.getUTCMonth() + 1);
	strDate += "-" + addZero(currentDate.getUTCDate());
	strDate += " " + addZero(currentDate.getUTCHours());
	strDate += ":" + addZero(currentDate.getUTCMinutes());
	strDate += ":" + addZero(currentDate.getUTCSeconds());
	strDate += "." + addZero2(currentDate.getUTCMilliseconds());
	return strDate;
}

function addZero(str) {
	str = str.toString();
	if (str.length == 1) {
		return "0" + str;
	}
	return str;
}

function addZero2(str) {
	str = str.toString();
	if (str.length == 1) {
		return "00" + str;
	}

	if (str.length == 2) {
		return "0" + str;
	}

	return str;
}

exports.getFormattedTime = getFormattedTime;