
module.exports.test_pageview = function (){
	return {
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

var daysBeforeNow = function (days) {
	var d = new Date();
	d.setDate(d.getDate() - days);
	return d;
};
module.exports.daysBeforeNow = daysBeforeNow;

module.exports.yesterday = function () {
	return daysBeforeNow(1);
};

module.exports.oneWeekAgo = function () {
	return daysBeforeNow(8);
};

module.exports.oneMonthAgo = function () {
	return daysBeforeNow(32);
};

module.exports.oneYearAgo = function () {
	return daysBeforeNow(366);
};

module.exports.earlyVeryEarly = function () {
	return Date.parse("1900-01-01");
};