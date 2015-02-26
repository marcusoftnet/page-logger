var render = require("../lib/render.js");
var config = require("../config/index.js")();
var pageViews = require('../lib/db.js').pageViews(config.mongoUrl);
var _ = require("underscore");

var helpers = require("./routeHelpers.js");

module.exports.showHome = function *(){
	var apps = yield pageViews.distinct("appname");
	this.body = yield render("home.html", { appnames : apps });
};