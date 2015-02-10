var parse = require("co-body");
var render = require("./lib/render.js");
var config = require("./config/index.js")();
var pageViews = require('./lib/db.js').pageViews(config.mongoUrl);

module.exports.showHome = function *(){
	var apps = yield pageViews.distinct("appname");
	this.body = yield render("home.html", { appnames : apps });
};

module.exports.showStatsPerApp = function *(appName){
	var views = yield pageViews.find({appname : appName }, { sort : { hits : -1 }});
	this.body = yield render("appStats.html", { appname : appName, views : views });
};

module.exports.storePageView = function *(){
	var postedPageview = yield parse(this);

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

	// Validate application name
	if(!exists(postedPageview.appname)){
		this.set('ErrorMessage', "Application name is required");
		this.status = 400;
		return;
	}

	var toStore = {
		url : postedPageview.url,
		title : postedPageview.title,
		appname : postedPageview.appname,
		hits : 1
	};

	console.dir("Storing page view for:" + toStore.url)

	// store in database
	var existingPost = yield pageViews.findOne({ url : toStore.url});
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

	this.status = 201; //Created - no way to get the resource back out
};


// Helpers
var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};