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

	describe('On the site', function () {
		beforeEach(function (done) {
			co(function *(){
				for (var i = 1; i <= 10; i++) {
					yield pageViews.insert({
						hits : 10 * i,
						appname: 'www.marcusoft.net',
						title: 'Awesome post ' + i,
						url : 'http://www.marcusoft.net/2015/01/mypost' + i + '.html',
						viewedAt : new Date
					});
				};

				done();
			});
		});

		it('all applications are listed', function (done) {
			request
				.get('/')
				.expect(200)
				.expect(function (res) {
		  			res.text.should.containEql("www.marcusoft.net");
		  			res.text.should.not.containEql("Kalle");
		  		})
				.end(done);
		});

		it('per application, all the stats is listed', function (done) {
			request
				.get('/www.marcusoft.net')
				.expect(200)
				.expect(function (res) {
		  			res.text.should.containEql("Awesome post 1");
		  			res.text.should.containEql("Awesome post 2");
		  			res.text.should.containEql("Awesome post 3");
		  			res.text.should.containEql("Awesome post 4");
		  			res.text.should.containEql("Awesome post 5");
		  			res.text.should.containEql("Awesome post 6");
		  			res.text.should.containEql("Awesome post 7");
		  			res.text.should.containEql("Awesome post 8");
		  			res.text.should.containEql("Awesome post 9");
		  			res.text.should.containEql("Awesome post 10");

		  			res.text.should.not.containEql("Awesome post 11");

		  			res.text.should.containEql("<td>10</td>");
		  			res.text.should.containEql("<td>20</td>");
		  			res.text.should.containEql("<td>30</td>");
		  			res.text.should.containEql("<td>40</td>");
		  			res.text.should.containEql("<td>50</td>");
		  			res.text.should.containEql("<td>60</td>");
		  			res.text.should.containEql("<td>70</td>");
		  		})
				.end(done);
		});

		it('per application, there are links to filter the page views', function (done) {
			request
				.get('/www.marcusoft.net')
				.expect(function (res) {
		  			res.text.should.containEql("Day");
		  			res.text.should.containEql("Week");
		  			res.text.should.containEql("Month");
		  			res.text.should.containEql("Year");
		  			res.text.should.containEql("All");
		  		})
		  		.end(done);
		});

		describe('I can view the pageviews per application', function () {
			var TEST_URL = '/www.marcusoft.net/?filter=';

			function insertDatedTestPosts(){
				return [
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', hits: 10, title: 'Post today', viewedAt : testHelpers.today()}),
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post2.html', hits: 10, title: 'Post yesterday', viewedAt : testHelpers.yesterday()}),
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post3.html', hits: 10, title: 'Post more than a week ago', viewedAt : testHelpers.oneWeekAgo()}),
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post4.html', hits: 10, title: 'Post more than a month ago', viewedAt : testHelpers.oneMonthAgo()}),
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post5.html', hits: 10, title: 'Post more than a year ago', viewedAt : testHelpers.oneYearAgo()}),
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post6.html', hits: 10, title: 'Post since like forever...', viewedAt : testHelpers.earlyVeryEarly()})
				];
			};

			it('for the last day', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL + 'day')
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.not.containEql("Post yesterday");
		  				})
						.end(done);
				});
			});

			it('btw, no filter is the same as last day', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL)
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.not.containEql("Post yesterday");
		  				})
						.end(done);
				});
			});

			it('for the last week', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL + 'week')
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.containEql("Post yesterday");
		  					res.text.should.not.containEql("Post more than a week ago");
		  		 		})
						.end(done);
				});
			});
			it('for the last month', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL + 'month')
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.containEql("Post yesterday");
		  					res.text.should.containEql("Post more than a week ago");
		  					res.text.should.not.containEql("Post more than a month ago");
		  		 		})
						.end(done);
				});
			});
			it('for the last year', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL + 'year')
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.containEql("Post yesterday");
		  					res.text.should.containEql("Post more than a week ago");
		  					res.text.should.containEql("Post more than a month ago");
		  					res.text.should.not.containEql("Post more than a year ago");
		  		 		})
						.end(done);
				});
			});
			it('for all time, ever and ever - Amen!', function (done) {
				co(function *(){
					yield insertDatedTestPosts();

					request
						.get(TEST_URL + 'all')
						.expect(function (res) {
		  					res.text.should.containEql("Post today");
		  					res.text.should.containEql("Post yesterday");
		  					res.text.should.containEql("Post more than a week ago");
		  					res.text.should.containEql("Post more than a month ago");
		  					res.text.should.containEql("Post more than a year ago");
		  					res.text.should.not.containEql("Post since like forever...");
		  		 		})
						.end(done);
				});
			});
			it('the data is grouped by url', function (done) {
				co(function *(){
					yield pageViews.remove({});

					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.today(), hits: 1});
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.today(), hits: 1});
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.today(), hits: 1});

					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.yesterday(), hits: 1});
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.yesterday(), hits: 1});
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.yesterday(), hits: 1});
					pageViews.insert({ appname: 'www.marcusoft.net', url : 'http://www.marcusoft.net/post1.html', title: 'Post', viewedAt : testHelpers.yesterday(), hits: 1});


					request
						.get(TEST_URL + 'week')
						.expect(function (res) {
		  					res.text.should.containEql("Post");
		  					res.text.should.containEql("<td>7</td>");

		  					// Should only have 3 <tr>, one for header and a single data row and a total
		  					res.text.split("<tr>").length.should.equal(4);
		  		 		})
						.end(done);
				});
			});
		});

		describe('I can view views per page also', function () {

			var TEST_URL = "http://www.marcusoft.net/2015/04/post.html";
			var TEST_URL_ENC = encodeURIComponent(TEST_URL);
			var TEST_TITLE = "Title";
			var APP_NAME = "www.marcusoft.net";

			function insertDatedTestPosts(){
				return [
					pageViews.insert({ appname: APP_NAME, url : TEST_URL, hits: 10, title: TEST_TITLE, viewedAt : testHelpers.today()}),
					pageViews.insert({ appname: APP_NAME, url : TEST_URL, hits: 20, title: TEST_TITLE, viewedAt : testHelpers.yesterday()}),
					pageViews.insert({ appname: APP_NAME, url : TEST_URL, hits: 30, title: TEST_TITLE, viewedAt : testHelpers.oneWeekAgo()}),
					pageViews.insert({ appname: APP_NAME, url : TEST_URL, hits: 40, title: TEST_TITLE, viewedAt : testHelpers.oneMonthAgo()}),
					pageViews.insert({ appname: APP_NAME, url : TEST_URL, hits: 50, title: TEST_TITLE, viewedAt : testHelpers.oneYearAgo()}),
				];
			};

			beforeEach(function (done) {
				co(function *(){
					yield insertDatedTestPosts();
					done();
				});
			});
			it('has a page for a url', function (done) {
				request
					.get('/url/'+ TEST_URL_ENC)
					.expect(200)
					.expect(function (res) {
			  			res.text.should.containEql(TEST_URL);
			  			res.text.should.containEql(TEST_TITLE);
			  		})
					.end(done);
			});
			it('displays all the hits for that url', function (done) {
				request
					.get('/url/'+ TEST_URL_ENC)
					.expect(200)
					.expect(function (res) {
			  			res.text.should.containEql("50");
			  			res.text.should.containEql("40");
			  			res.text.should.containEql("30");
			  			res.text.should.containEql("20");
			  			res.text.should.containEql("10");
			  		})
					.end(done);
			});
			it('displays the hits in date order', function (done) {
				request
					.get('/url/'+ TEST_URL_ENC)
					.expect(200)
					.expect(function (res) {
			  			res.text.should.containEql("[50,40,30,20,10]");
			  		})
					.end(done);
			});
		});
	});
});