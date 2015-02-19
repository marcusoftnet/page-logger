var parse = require("co-body");
var config = require("../config/index.js")();
var pageViews = require('../lib/db.js').pageViews(config.mongoUrl);
var helpers = require("./routeHelpers.js");

module.exports.storePageView = function *(){
	var postedPageview = yield parse(this);

	if(!helpers.exists(this.get("origin"))){
		return setError(this, "Application needs to be supplied in the Origin-header");
	}
	var applicationName = helpers.getAppName(this.get("origin"));

	if(!helpers.arrayElementExists(config.clients, applicationName)){
		console.log('Denied: ' + applicationName);
		return setError(this, "Application not approved");
	}

	// Validate url
	if(!helpers.exists(postedPageview.url)){ return setError(this, "Url is required"); }

	// Validate title
	if(!helpers.exists(postedPageview.title)){ return setError(this, "Title is required"); }

	var toStore = {
		appname : applicationName,
		url : postedPageview.url,
		title : postedPageview.title,
		viewedAt : new Date,
		hits : 1
	};

	// Storing the pageviews per day
	var existingPost = yield pageViews.findOne(
		{ $and: [
			{ url : toStore.url},
			{ viewedAt : {
				$gt : helpers.startOfDay(toStore.viewedAt),
				$lt : helpers.endOfDay(toStore.viewedAt)
			}}
		]}
	);

	// insert or update in database
	if(helpers.exists(existingPost)){
		yield pageViews.update(
			{ _id : existingPost._id},
			{ $inc: { hits : 1}},
    		{ upsert : true, safe : false}
    	);
	}
	else {
		yield pageViews.insert(toStore);
	}

	this.status = 201; //Created - we don't supply a way to get the resource back out
};

function setError(context, message){
	context.set('ErrorMessage', message);
	context.status = 400;
};