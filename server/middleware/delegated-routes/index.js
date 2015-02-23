/**
 * Create a middleware to delegate http requests
 * @param {Object} options Options
 * @returns {Function} The express middleware handler
 */
module.exports = function(app) {

	// aggregate owing
	var owing = require('./owing-aggregator')();
	var owingRoute = '/api/tc3webservice/v1/payment/owing/:account_id/:token';
	app.get(owingRoute, owing.transformResp, owing.getItemised);

	// delegate fingerprint api
	var securepay = require('./securepay')();
	var getRoute = '/api/tc3webservice/v1/payment/fingerprint/:account_id/:amount/:token';
	app.get(getRoute, securepay.getPaymentFP);

	// delegate fingerprint api
	var fingerprintMethodRoute = '/api/tc3webservice/v1/paymentmethod/fingerprint/:account_id/:token';
	app.get(fingerprintMethodRoute, securepay.getMethodFP);

	// delegate securepay callback route
	app.post('/api/tc3webservice/v1/payment/callback/:type', securepay.callback);

	// delegate update payment method
	app.post('/api/tc3webservice/v1/payment/method/20011176/:token', securepay.paymentMethod);


};
