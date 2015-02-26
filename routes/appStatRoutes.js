var parse = require("co-body");
var render = require("../lib/render.js");
var config = require("../config/index.js")();
var pageViews = require('../lib/db.js').pageViews(config.mongoUrl);
var _ = require("underscore");
var helpers = require("./routeHelpers.js");

module.exports.showStatsPerApp = function *(appName){

	// create a object that returns all the pageviews within the requested range
	var query = createStatsPerAppViewQuery(appName, this.query);

	// Sort on url
	var sortOptions = { sort : { url: 1 }};

	// Perform the search
	var viewsFromMongo = yield pageViews.find(query, sortOptions);

	// This should be done by group in mongo... but for the life of me...
	var grouped = groupByUrl(viewsFromMongo);
	var views = _.sortBy(grouped, "hits").reverse();
	views = _.filter(views, function (v) { return v.hits > 1 });

	// Render
	this.body = yield render("appStats.html", { appname : appName, views : views });
};

var groupByUrl = function(viewsFromMongo){
	var views = [];
	var url = "";
	for (var i = 0; i < viewsFromMongo.length; i++) {
		if(url !== viewsFromMongo[i].url){
			// add new document to the result
			views.push(viewsFromMongo[i]);
		}
		else if(url === viewsFromMongo[i].url){
			// Find the element in the views collection and increment the number
			var index = findByUrl(views, url);
			views[index].hits += viewsFromMongo[i].hits;
		}
		url = viewsFromMongo[i].url;
	};

	return views;
};

function findByUrl(source, url) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].url === url) {
      return i;
    }
  }
};

var createStatsPerAppViewQuery = function(postedAppName, queryString){
	var filterQsParam = queryString.filter || "day";
	var start = new Date();
	var stop = start;

	if(filterQsParam === "week") {
		start = new Date();
		start.setDate(stop.getDate() - 7);
	}
	else if(filterQsParam === "month"){
		start = new Date();
		start.setDate(stop.getDate() - 30);
	}
	else if(filterQsParam === "year"){
		start = new Date();
		start.setDate(stop.getDate() - 365);
	}
	else if(filterQsParam === "all"){
		start = Date.parse("1970-01-01");
	}

	var query = {
		$and:[
			{ appname : postedAppName },
			{ viewedAt : {
				$gte : helpers.startOfDay(start),
				$lte : helpers.endOfDay(stop)
			}}
		]
	};

	// Left here for debugging
	// console.log(filterQsParam);
	// console.log("Start: " + startOfDay(start));
	// console.log("Stop : " + endOfDay(stop));

	return query;
};