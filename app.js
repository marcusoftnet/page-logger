var app = module.exports = require("koa")();
var route = require("koa-route");
var cors = require("koa-cors");
var parse = require("co-body");
var serve = require('koa-static');

var config = require("./config/index.js")();

// Configuration
app.use(serve(__dirname + '/public'));
app.use(cors());

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