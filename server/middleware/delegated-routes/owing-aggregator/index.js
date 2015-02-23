/*jshint camelcase: false */

var httpProxy = require('http-proxy'),
	proxy = new httpProxy.createProxyServer(),
	tamper = require('tamper');



/**
 * Create a middleware to aggregate request
 *
 * @returns {Function} The express middleware handler
 */
module.exports = function() {

	return {

		getItemised: function(req, res) {

			req.url = '/api/tc3webservice/v1/invoice/summary/';
			req.url += req.params.account_id + '/' + req.params.token + '/';

			proxy.web(req, res, {
				target: 'http://pmrssc4dev.m2group.com.au:8081'
			});

		},

		transformResp: tamper(function(req, res) {
				// In this case we only want to modify html responses:
				if (res.getHeader('Content-Type') !== 'application/octet-stream') {
					return;
				}

				// Return a function in order to capture and modify the response body:
				return function(body) {
					var bodyObj = JSON.parse(body);
					var OpenAmount = JSON.parse(body).DataObject.Invoices
						.reduce(function(a, b) {
							return a + b.OpenAmount;
						}, 0.00);
					delete bodyObj.DataObject.Invoices;
					bodyObj.DataObject.OpenAmount = OpenAmount;
					return JSON.stringify(bodyObj);
				};
		})

	};

};
