'use strict';

/*jshint quotmark:false */ //beacuse we have json in api payload

var should = require('chai').should(),
	supertest = require('supertest'),
	api = supertest('http://localhost:3000/api/tc3webservice/v1/');


describe(' API > ', function() {

	var token = '/036069024159015091111182178164218061225204162208233201231148079058071029137182099092227019103101209192088203044107246004007112144209201238224252/'; // jshint ignore:line

	function saveToken(res) {
		var json = JSON.parse(res.text);
		token = '/' + json.Token + '/';
	}

	var baseGet = {
		'Accept': 'application/json, text/plain, */*',
		'Accept-Encoding': 'gzip, deflate, sdch',
		'Accept-Language': 'en-US,en;q=0.8',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'Host': 'localhost:3000',
		'Origin': 'https://localhost:7777',
		'Pragma': 'no-cache',
		'Referer': 'https://localhost:7777/',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.6 Safari/537.36' // jshint ignore:line
	};

	var basePost = {
		'Accept': 'application/json, text/plain, */*',
		'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'en-US,en;q=0.8',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'Content-Type': 'application/json; charset=UTF-8',
		'Host': 'localhost:3000',
		'Origin': 'https://localhost:7777',
		'Pragma': 'no-cache',
		'Referer': 'https://localhost:7777/',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.6 Safari/537.36' // jshint ignore:line
	};


	describe('Login', function() {

		it(' should reject requests with invalid tokens', function(done) {
			api.get('user/summary' + token)
				.set(baseGet)
				.expect(403)
				.end(done);
		});


		it(' should have CORS enambled for session post', function(done) {
			api.options('session/')
				.set('Accept', '*/*')
				.set('Accept-Encoding', 'gzip, deflate, sdch')
				.set('Accept-Language', 'en-US,en;q=0.8')
				.set('Access-Control-Request-Headers', 'accept, content-type')
				.set('Access-Control-Request-Method', 'POST')
				.set('Cache-Control', 'no-cache')
				.set('Connection', 'keep-alive')
				.set('Host', 'pmrssc4dev.m2group.com.au:8081')
				.set('Origin', 'https://localhost:7777')
				.set('Pragma', 'no-cache')
				.set('Referer', 'https://localhost:7777/')
				.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.6 Safari/537.36') // jshint ignore:line
				.expect(200)
				.end(done);
		});

		it(' should be able to login', function(done) {
			api.post('session/')
				.set(basePost)
				.set('Content-Length', '45')
				.send({
					"username": "20011176",
					"password": "password"
				})
				.expect(200)
				.end(function(err, res) {
					should.not.exist(err);
					saveToken(res);
					done();
				});
		});



	});

});
