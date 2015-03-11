var app = module.exports = require("koa")();
var route = require("koa-route");
var cors = require("koa-cors");
var parse = require("co-body");
var serve = require('koa-static');
var favicon = require('koa-favicon');

var config = require("./config/index.js")();

// Configuration
app.use(cors());
app.use(serve(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
var homeRoutes = require("./routes/homeRoutes.js");
var appStatsRoutes = require("./routes/appStatsRoutes.js");
var urlStatsRoutes = require("./routes/urlStatsRoutes.js");
var apiRoutes = require("./routes/apiRoutes.js");

app.use(route.get("/url/:url", urlStatsRoutes.showUrlStats));
app.use(route.get("/:appName", appStatsRoutes.showStatsPerApp));
app.use(route.get("/", homeRoutes.showHome));

app.use(route.post("/api/pageview", apiRoutes.storePageView));

// Start up
app.listen(config.port);
console.log("Started, with the following configuration: ");
console.log(config);