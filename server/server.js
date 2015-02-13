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

// Redirect http requests to https
var httpsPort = app.get('https-port');
app.middleware('routes', httpsRedirect({httpsPort: httpsPort}));

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
