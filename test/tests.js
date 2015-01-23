var co = require("co");
var app = require('../app.js');
var request = require('supertest').agent(app.listen());

describe('Page-logger API', function(){

	var test_pageview  = {};

	beforeEach(function(done){
		 test_pageview  = {
		 	appname: 'www.marcusoft.net',
		 	title: 'Awesome post',
		 	url : 'http://www.marcusoft.net/2015/01/mypost.html'
		 };

		 done();
	});

	it('stores a page view with all fields set', function(done){
		// Post
		request
			.post('/pageview')
			.send(test_pageview)
			.expect(201, done);
	});

	it('requires URL', function(done){
		co(function(){
			delete test_pageview.url;

			// Post
			request
				.post('/pageview')
				.send(test_pageview)
				.expect("ErrorMessage", "Url is required")
				.expect(400, done);
		});
	});

	it('requires title', function(done){
		co(function(){
			delete test_pageview.title;

			// Post
			request
				.post('/pageview')
				.send(test_pageview)
				.expect("ErrorMessage", "Title is required")
				.expect(400, done);
		});
	});

	it('requires application name', function(done){
		co(function(){
			delete test_pageview.appname;

			// Post
			request
				.post('/pageview')
				.send(test_pageview)
				.expect("ErrorMessage", "Application name is required")
				.expect(400, done);
		});
	});
});