var render = require("../lib/render.js");
var config = require("../config/index.js")();
var pageViews = require('../lib/db.js').pageViews(config.mongoUrl);
var _ = require("underscore");

var helpers = require("./routeHelpers.js");

module.exports.showUrlStats = function *(urlEncoded){
	var url = decodeURIComponent(urlEncoded);

	var pageViewsForUrl = yield pageViews.find({url : url}, { sort : { viewedAt: 1 }});
	var vm = createVmForUrlStats(pageViewsForUrl);

	this.body = yield render("url.html", vm);
};

var createVmForUrlStats = function (pageViewsForUrl) {
	var firstView = _.find(pageViewsForUrl, function(v){ return v.title != ""; });
	var viewDates = _.map(pageViewsForUrl, function (v) { return dateToYYMMDD(v.viewedAt);});
	var hits = _.pluck(pageViewsForUrl, 'hits');
	var totalHits = _.reduce(hits, function(memo, num){ return memo + num; }, 0);

	return {
		hits : hits,
		totalHits : totalHits,
		viewsAt : viewDates,
		title : firstView.title,
		appname : firstView.appname,
		url : firstView.url
	};
};


var dateToYYMMDD = function(date) {
	    var d = date.getDate();
	    var m = date.getMonth() + 1;
	    var y = date.getFullYear();
	    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
};