var parse = require("co-body");
var render = require("./lib/render.js");
var config = require("./config/index.js")();
var pageViews = require('./lib/db.js').pageViews(config.mongoUrl);

module.exports.showHome = function *(){
	var apps = yield pageViews.distinct("appname");
	this.body = yield render("home.html", { appnames : apps });
};

module.exports.showStatsPerApp = function *(appName){

	// create a object that returns all the pageviews within the requested range
	var query = createStatsPerAppViewQuery(appName, this.query);

	// Sort on number of hits
	var sortOptions = { sort : { hits : -1 }};

	// Perform the search
	var viewsFromMongo = yield pageViews.find(query, sortOptions);

	// This should be done by group in mongo... but for the life of me...
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

	// Render
	this.body = yield render("appStats.html", { appname : appName, views : views });
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
		$and:
		[
			{ appname : postedAppName },
			{ viewedAt : {
				$gte : startOfDay(start),
				$lte : endOfDay(stop)
			}}
		]
	};

	// Left here for debugging
	// console.log(filterQsParam);
	// console.log("Start: " + startOfDay(start));
	// console.log("Stop : " + endOfDay(stop));

	return query;
};

module.exports.storePageView = function *(){
	var postedPageview = yield parse(this);

	if(!exists(this.get("origin"))){
		this.set('ErrorMessage', "Application needs to be supplied in the Origin-header");
		this.status = 400;
		return;
	}
	var applicationName = getAppName(this.get("origin"));

	if(!arrayElementExists(config.clients, applicationName)){
		console.log('Denied: ' + applicationName);
		this.set('ErrorMessage', "Application not approved");
		this.status = 400;
		return;
	}

	// Validate url
	if(!exists(postedPageview.url)){
		this.set('ErrorMessage', "Url is required");
		this.status = 400;
		return;
	}

	// Validate title
	if(!exists(postedPageview.title)){
		this.set('ErrorMessage', "Title is required");
		this.status = 400;
		return;
	}

	var toStore = {
		appname : applicationName,
		url : postedPageview.url,
		title : postedPageview.title,
		viewedAt : new Date,
		hits : 1
	};

	// HERE's my trick. Basically I'm storing the page views with one day
	// resolution. That works for now.
	// another approach is to always insert with the current timestamp
	// giving ms resolution. That means that the aggregration needs to be
	// done when we read it back. Now we do the "aggregation" here instead
	var existingPost = yield pageViews.findOne(
		{ $and: [
			{ url : toStore.url},
			{ viewedAt : {
				$gt : startOfDay(toStore.viewedAt),
				$lt : endOfDay(toStore.viewedAt)
			}}
		]}
	);

	// store in database
	if(exists(existingPost)){
		yield pageViews.update(
			{ _id : existingPost._id},
			{ $inc: { hits : 1}},
    		{ upsert : true, safe : false}
    	);
	}
	else{
		yield pageViews.insert(toStore);
	}

	this.status = 201; //Created - we don't supply a way to get the resource back out
};

var startOfDay = function (inDate) {
	var d = new Date(inDate);
	d.setSeconds(0);
	d.setHours(0);
	d.setMinutes(0);

	return d;
};

var endOfDay = function(inDate){
	var d = new Date(inDate);
	d.setHours(23);
	d.setMinutes(59);
	d.setSeconds(59);

	return d;
};

// Helpers
var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};

var arrayElementExists = function (arr, element) {
	return arr.indexOf(element)>-1;
}

function findByUrl(source, url) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].url === url) {
      return i;
    }
  }
}

var getAppName = function(originHeader){
	var origin = originHeader || "";
	var protocolDelimiter = "://";
	var index = origin.indexOf("://");
	return index > -1 ? origin.slice(index + protocolDelimiter.length) : origin;
}