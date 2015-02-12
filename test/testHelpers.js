
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