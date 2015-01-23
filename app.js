var app = module.exports = require("koa")();
var route = require("koa-route");
var parse = require("co-body");
var handlers = require("./routes.js");
var config = require("./config/index.js")();

// routes
app.use(route.get("/", handlers.showHome));
app.use(route.get("/{appName}", handlers.showStatsPerApp));
app.use(route.post("/pageview", handlers.storePageView));

// Start up
app.listen(config.port);
console.log("Started");
console.log("Port: " + config.port);
console.log("Db: " + config.mongoUrl);