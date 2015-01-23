var co = require("co");
var should = require("should");
var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var monk = require("monk");
var wrap = require("co-monk");
var db = monk('localhost:27017/pagelogger_dev');
var pageViews = wrap(db.get('page_views'));

describe('Page-logger', function(){

	var test_pageview  = {};

	beforeEach(function(done){
		co(function *(){
			test_pageview  = {
				appname: 'www.marcusoft.net',
				title: 'Awesome post',
				url : 'http://www.marcusoft.net/2015/01/mypost.html'
			};

			yield pageViews.remove({});

			done();
		});
	});

	describe('Page-logger home page', function () {
		beforeEach(function (done) {
			co(function *(){
				for (var i = 1; i < 10; i++) {
					yield pageViews.insert({
						hits : 10 * i,
						appname: 'www.marcusoft.net',
						title: 'Awesome post' + i,
						url : 'http://www.marcusoft.net/2015/01/mypost' + i + '.html'
					});
				};

				done();
			});
		});

		it('list all the posts on the homepage', function (done) {
			request
				.get('/')
				.expect(200)
				.end(done);
		});
	});

	describe('Page-logger API', function(){

		it('stores a page view with all fields set', function(done){
			// Post
			request
				.post('/pageview')
				.send(test_pageview)
				.expect(201, done);
		});

		it('storing two page views increments the hits', function(done){
			co(function *(){
				test_pageview.hits = 100;
				yield pageViews.insert(test_pageview);

				// Post a new page view
				request
					.post('/pageview')
					.send(test_pageview)
					.expect(201)
					.end(done);

			});
		});

		describe('Page-logger API validation', function(){

			it('requires URL', function(done){
				co(function *(){
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
				co(function *(){
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
				co(function *(){
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
	});
});