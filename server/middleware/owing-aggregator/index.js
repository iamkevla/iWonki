var httpProxy = require('http-proxy');

/**
 * Create a middleware to aggregate request
 *
 * @returns {Function} The express middleware handler
 */
module.exports = function() {
	
	var proxy = new httpProxy.createProxyServer();
	
  return function(req, res){
		
		req.url = '/api/tc3webservice/v1/invoice/summary/' + req.params.account_id + '/' + req.params.token + '/';
		
		proxy.web(req, res, {target: 'http://pmrssc4dev.m2group.com.au:8081'}, function (e, req, res, next) {
			console.log(['proxy response', res.DataObject]);
			
			
		});

	};

};