var app = module.exports = require("koa")();
var route = require("koa-route");
var parse = require("co-body");

// routes
app.use(route.get("/", showHome));
app.use(route.post("/pageview", logPageView));

// Start up
app.listen(3000);
console.dir("Application started on http://localhost:3000");

// route handlers
var monk = require("monk");
var wrap = require("co-monk");
var db = monk('localhost:27017/pagelogger_dev');
var pageViews = wrap(db.get('page_views'));


function *showHome(){
	var data = yield pageViews.find({});
	console.log(data);
	this.body = yield render("home", data);
};


function *logPageView(){
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


var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};