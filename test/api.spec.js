var co = require("co");
var should = require("should");
var testHelpers = require("./testHelpers.js");

var request = testHelpers.request;
var pageViews = testHelpers.pageViews;

describe('Page-logger', function(){

	beforeEach(function(done){
		co(function *(){
			yield pageViews.remove({});
			done();
		});
	});

	describe('Page-logger API', function(){
		var API_POST_URL = '/api/pageview';

		it('stores a page view with all fields set', function(done){
			// Post
			request
				.post(API_POST_URL)
				.set('Origin', 'www.marcusoft.com')
				.send(testHelpers.test_pageview())
				.expect(201, done);
		});

		it('storing two page views increments the hits', function(done){
			co(function *(){
				var tv = testHelpers.test_pageview();
				tv.hits = 100;
				yield pageViews.insert(tv);

				// Post a new page view
				request
					.post(API_POST_URL)
					.set('Origin', 'www.marcusoft.com')
					.send(testHelpers.test_pageview())
					.expect(201)
					.end(done);

			});
		});

		it('storing two page views at different times creates two pageViews', function(done){
			co(function *(){
				var tv = testHelpers.test_pageview();
				tv.hits = 100;
				tv.viewedAt = Date.parse("2015-01-01");
				yield pageViews.insert(tv);

				// Post a new page view
				request
					.post(API_POST_URL)
					.set('Origin', 'www.marcusoft.com')
					.send(testHelpers.test_pageview())
					.expect(201)
					.end(done);

			});
		});

		describe('Page-logger API validation', function(){
			it('only accept posts from localhost and marcusoft.net' , function(done){
				request
					.post(API_POST_URL)
					.set('Origin', 'anotherdomain.com')
					.send(testHelpers.test_pageview())
					.expect("Access-Control-Allow-Origin", "anotherdomain.com")
					.end(done);
			});

			it('requires URL', function(done){
				co(function *(){
					var tv = testHelpers.test_pageview();
					delete tv.url;

					// Post
					request
						.post(API_POST_URL)
						.set('Origin', 'www.marcusoft.com')
						.send(tv)
						.expect("ErrorMessage", "Url is required")
						.expect(400, done);
				});
			});

			it('requires title', function(done){
				co(function *(){
					var tv = testHelpers.test_pageview();
					delete tv.title;

					// Post
					request
						.post(API_POST_URL)
						.set('Origin', 'www.marcusoft.com')
						.send(tv)
						.expect("ErrorMessage", "Title is required")
						.expect(400, done);
				});
			});

			it('requires origin header', function(done){
				co(function *(){
					var tv = testHelpers.test_pageview();
					
					// Post
					request
						.post(API_POST_URL)
						.send(tv)
						.expect("ErrorMessage", "Application needs to be supplied in the Origin-header")
						.expect(400, done);
				});
			});
		});
	});
});