var co = require("co");
var should = require("should");
var app = require('../app.js');
var request = require('supertest').agent(app.listen());
var config = require("../config/index.js")('local');

var pageViews = require('../lib/db.js').pageViews(config.mongoUrl);

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

		it('per application, there are links to filter the page views');
	});
});