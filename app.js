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
function *showHome(){
	this.body = "You're home buddy!"
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

	// store in database

	console.log(postedPageview);

	this.status = 201; //Created - no way to get the resource back out
};


var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};