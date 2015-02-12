
module.exports.test_pageview = function (){
	return {
		appname: 'www.marcusoft.net',
		title: 'Awesome post',
		url : 'http://www.marcusoft.net/2015/01/mypost.html'
	};
};

var config = require("../config/index.js")('local');
module.exports.pageViews = require('../lib/db.js').pageViews(config.mongoUrl);

var app = require('../app.js');
module.exports.request = require('supertest').agent(app.listen());


module.exports.today = function () {
	return new Date();
};

module.exports.yesterday = function () {
	var d = new Date();
	d.setDate(d.getDate() - 1);
	return d;
};

module.exports.oneWeekAgo = function () {
	var d = new Date();
	d.setDate(d.getDate() - 8);
	return d;
};

module.exports.oneMonthAgo = function () {
	var d = new Date();
	d.setDate(d.getDate() - 32);
	return d;
};

module.exports.oneYearAgo = function () {
	var d = new Date();
	d.setDate(d.getDate() - 366);
	return d;
};

module.exports.earlyVeryEarly = function () {
	return Date.parse("1970-01-01");
};