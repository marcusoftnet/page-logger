var app = module.exports = require("koa")();
var route = require("koa-route");
var parse = require("co-body");
var cors = require('koa-cors');
var handlers = require("./routes.js");
var config = require("./config/index.js")();

// Configuration
var origin = 'http://www.marcusoft.net';
var origin = process.env.ORIGIN || 'http://www.marcusoft.net';
app.use(cors({ origin: origin, methods : ['POST'] }));

// routes
app.use(route.get("/", handlers.showHome));
app.use(route.get("/:appName", handlers.showStatsPerApp));
app.use(route.post("/api/pageview", handlers.storePageView));

// Start up
app.listen(config.port);
console.log("Started, with the following configuration: ");
console.log(config);