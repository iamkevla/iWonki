var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('https');
var path = require('path');
var httpsRedirect = require('./middleware/https-redirect');
var sslCert = require('./private/ssl_cert');




var httpsOptions = {
  key: sslCert.privateKey,
  cert: sslCert.certificate
};

var app = module.exports = loopback();

// Set up the /favicon.ico
app.middleware('initial', loopback.favicon());

// request pre-processing middleware
app.middleware('initial', loopback.compress());

app.middleware('session', loopback.session({ saveUninitialized: true,
  resave: true, secret: 'keyboard cat' }));

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
boot(app, __dirname);

function transformResp(req, res, next) {
	var _write = res.write;
	var _writeHead = res.writeHead;

	res.writeHead = function(statusCode, headers) {
		res.removeHeader('Content-Length');
		if (headers) {
			delete headers['content-length'];
		}
		_writeHead.apply(res, arguments);
	};

	res.write = function(data) {
		var body = data.toString();
		var bodyObj = JSON.parse(body);
		var OpenAmount = JSON.parse(body).DataObject.Invoices
			.reduce(function(a, b) {
				return a + b.OpenAmount;
			}, 0.00);
		delete bodyObj.DataObject.Invoices;
		bodyObj.DataObject.OpenAmount = OpenAmount;
		_write.call(res, JSON.stringify(bodyObj));
	};

	next();
}

//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
};

app.use(allowCrossDomain);


// Redirect http requests to https
var httpsPort = app.get('https-port');
app.middleware('routes', httpsRedirect({httpsPort: httpsPort}));

// delegate owing to our own function
var owing = require('./middleware/owing-aggregator')();
var owingRoute = '/api/tc3webservice/v1/payment/owing/:account_id/:token';
app.get(owingRoute, transformResp, owing);

// delegate fingerprint api
var securepay = require('./middleware/securepay')();
var getRoute = '/api/tc3webservice/v1/payment/fingerprint/:account_id/:amount/:token';
app.get(getRoute, securepay.getPaymentFP);

// delegate fingerprint api
var fingerprintMethodRoute = '/api/tc3webservice/v1/paymentmethod/fingerprint/:account_id/:token';
app.get(fingerprintMethodRoute, securepay.getMethodFP);

// securepay callback route
app.post('/api/tc3webservice/v1/payment/callback/:type', securepay.callback);

app.post('/api/tc3webservice/v1/payment/method/20011176/:token', securepay.paymentMethod);


var rateLimiting = require('./middleware/rate-limiting');
app.middleware('routes:after', rateLimiting({limit: 100, interval: 60000}));

var proxy = require('./middleware/proxy');
var proxyOptions = require('./middleware/proxy/config.json');
app.middleware('routes:after', proxy(proxyOptions));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.middleware('final', loopback.urlNotFound());

// The ultimate error handler.
app.middleware('final', loopback.errorHandler());

app.start = function() {
  var port = app.get('port');

  http.createServer(app).listen(port, function() {
    console.log('Web server listening at: %s', 'http://localhost:3000/');
    https.createServer(httpsOptions, app).listen(httpsPort, function() {
      app.emit('started');
      console.log('Web server listening at: %s', app.get('url'));
    });
  });

};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
