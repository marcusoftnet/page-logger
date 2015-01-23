var monk = require('monk');
var wrap = require("co-monk");

module.exports.pageViews = function (mongoUrl) {
	var db = monk(mongoUrl);
	return wrap(db.get('page_views'));
};