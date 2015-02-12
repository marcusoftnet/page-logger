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
						url : 'http://www.marcusoft.net/2015/01/mypost' + i + '.html'
					});
				};

				done();
			});
		});

		it('all applications are listed', function (done) {
			request
				.get('/')
				.expect(200)
				.expect(function (req) {
		  			req.text.should.containEql("www.marcusoft.net");
		  			req.text.should.not.containEql("Kalle");
		  		})
				.end(done);
		});

		it('per application, all the stats is listed', function (done) {
			request
				.get('/www.marcusoft.net')
				.expect(200)
				.expect(function (req) {
		  			req.text.should.containEql("Awesome post 1");
		  			req.text.should.containEql("Awesome post 2");
		  			req.text.should.containEql("Awesome post 3");
		  			req.text.should.containEql("Awesome post 4");
		  			req.text.should.containEql("Awesome post 5");
		  			req.text.should.containEql("Awesome post 6");
		  			req.text.should.containEql("Awesome post 7");
		  			req.text.should.containEql("Awesome post 8");
		  			req.text.should.containEql("Awesome post 9");
		  			req.text.should.containEql("Awesome post 10");

		  			req.text.should.not.containEql("Awesome post 11");


		  			req.text.should.containEql("<td>10</td>");
		  			req.text.should.containEql("<td>20</td>");
		  			req.text.should.containEql("<td>30</td>");
		  			req.text.should.containEql("<td>40</td>");
		  			req.text.should.containEql("<td>50</td>");
		  			req.text.should.containEql("<td>60</td>");
		  			req.text.should.containEql("<td>70</td>");
		  		})
				.end(done);
		});

		it('per application, there are links to filter the page views', function (done) {
			request
				.get('/www.marcusoft.net')
				.expect(function (req) {
		  			req.text.should.containEql("Last 24 h");
		  			req.text.should.containEql("Last week");
		  			req.text.should.containEql("Last month");
		  			req.text.should.containEql("Last year");
		  			req.text.should.containEql("Last everything");
		  		})
		  		.end(done);
		});

		describe('I can view the pageviews', function () {
			it('for the last 24 h', function (done) {
				co(function *(){
					var today = new Date();
					var yesterday = new Date().setDate(today.getDate() - 1);

					yield pageViews.insert({ appname: 'www.marcusoft.net', title: 'Post today', viewedAt : today});
					yield pageViews.insert({ appname: 'www.marcusoft.net', title: 'Post yesterday', viewedAt : yesterday});

					request
						.get('/www.marcusoft.net/?filter=day')
						.expect(function (req) {
		  					req.text.should.containEql("Post today");
		  					req.text.should.not.containEql("Post yesterday");
		  				})
						.end(done);
				});
			});
			it('for the last week');
			it('for the last month');
			it('for the last all time');
		});
	});
});