var app = module.exports = require("koa")();
var route = require("koa-route");
var cors = require("koa-cors");
var parse = require("co-body");
var serve = require('koa-static');

var handlers = require("./routes.js");
var config = require("./config/index.js")();

// Configuration
app.use(serve(__dirname + '/public'));
app.use(cors());

// routes
app.use(route.get("/", handlers.showHome));
app.use(route.get("/:appName", handlers.showStatsPerApp));
app.use(route.post("/api/pageview", handlers.storePageView));

// Start up
app.listen(config.port);
console.log("Started, with the following configuration: ");
console.log(config);