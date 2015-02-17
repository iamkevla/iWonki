/*jshint camelcase: false */

var httpProxy = require('http-proxy');
var gremlin = require('proxy-gremlin');

/**
 * Create a middleware to aggregate request
 *
 * @returns {Function} The express middleware handler
 */
module.exports = function() {
	
	var proxy = new httpProxy.createProxyServer();
	
  return function(req, res) {
		
		req.url = '/api/tc3webservice/v1/invoice/summary/';
		req.url	+= req.params.account_id + '/' + req.params.token + '/';
		
		proxy.web(req, res, {target: 'http://pmrssc4dev.m2group.com.au:8081'});
		
		// tell proxy-gremlin to intercept this response before it goes out
		gremlin.intercept(res, function interceptor(buffer) {

			// change the response
			buffer.setData('Hello world'); // change the response's data
		});
		
	};

};