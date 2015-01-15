var app = module.exports = require("koa")();

var favicon = require('koa-favicon');
var config = require('./config')();
var routes = require('koa-route');
var serve = require('koa-static');
var logger = require('koa-logger');

// Middleware configuration
app.use(logger());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(serve(__dirname + '/public'));

// routes - site
app.use(routes.get("/", function *(){ this.body = "Yup - we're live!";}))

// routes - api
app.use(routes.post("/api/pageview", function *(){ this.body = "you posted";}))


// staring application
app.listen(config.port);
console.log('The app is listening. Port:'+ config.port);
