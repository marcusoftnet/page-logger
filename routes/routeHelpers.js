module.exports.startOfDay = function (inDate) {
	var d = new Date(inDate);
	d.setSeconds(0);
	d.setHours(0);
	d.setMinutes(0);

	return d;
};

module.exports.endOfDay = function(inDate){
	var d = new Date(inDate);
	d.setHours(23);
	d.setMinutes(59);
	d.setSeconds(59);

	return d;
};

module.exports.exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};

module.exports.arrayElementExists = function (arr, element) {
	return arr.indexOf(element)>-1;
}

module.exports.getAppName = function(originHeader){
	var origin = originHeader || "";
	var protocolDelimiter = "://";
	var index = origin.indexOf("://");
	return index > -1 ? origin.slice(index + protocolDelimiter.length) : origin;
}