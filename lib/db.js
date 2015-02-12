var monk = require('monk');
var wrap = require("co-monk");

var pageViews = function (mongoUrl) {
	var db = monk(mongoUrl);
	return wrap(db.get('page_views'));
};

pageViews.aggregate = function(aggregation){
    var collection = this.col;
    var options = {};
    return function (callback){
        return collection.aggregate(aggregation, options, callback)
    }
}

module.exports.pageViews = pageViews;