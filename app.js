var app = module.exports = require("koa")();
var route = require("koa-route");
var parse = require("co-body");
var cors = require('koa-cors');
var serve = require('koa-static');

var handlers = require("./routes.js");
var config = require("./config/index.js")();

// Configuration
app.use(cors({ origin: originFunction }));
app.use(serve(__dirname + '/public'));

// routes
app.use(route.get("/", handlers.showHome));
app.use(route.get("/:appName", handlers.showStatsPerApp));
app.use(route.post("/api/pageview", handlers.storePageView));

// Start up
app.listen(config.port);
console.log("Started, with the following configuration: ");
console.log(config);

var originFunction = function(req) {
	var originWhiteList = ["localhost", "marcusoft.net"];
	var origin = req.header.origin;
	if (originWhiteList.indexOf(origin) !== -1) {
		return origin;
	}
	return false;
};