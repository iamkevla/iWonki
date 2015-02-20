/*jshint camelcase:false  */

var crypto = require('crypto'),
		format = require('date-format'),
		config = require('./config.json');


/**
 * @name securepay.getPaymentFP
 *
 * @description generates a securepay fingerprint fior making a credit card payment
 *
 */
exports.getPaymentFP = function() {

	return function(req, res, next) {

		var amount = (req.params.amount / 100).toFixed(2),
				now = new Date(),
				utcDateTime = new Date(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds()
				),
				timestamp = format('yyyyMMddhhmmss', utcDateTime);

		// Type 0 for making a payment
		var buildString = config.merchant + '|' + config.password + '|0|';
		buildString += req.params.account_id + '|' + amount + '|' + timestamp;

		var shasum = crypto.createHash('sha1');
		shasum.update(buildString);

		var responseObj = {
			ExceptionObject: {
				DeveloperMessage: null,
				UserMessage: null,
				ErrorCode: 0,
				MoreInfo: null
			},
			Token: req.params.token,
			DataObject: {
				Timestamp: timestamp,
				Fingerprint: shasum.digest('hex')
			}
		};

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Content-Length', JSON.stringify(responseObj).length);
		res.send(JSON.stringify(responseObj));

	};

};


/**
 * @name securepay.getMethodFP
 *
 * @description generates a securepay fingerprint for authorising credit card
 */
exports.getMethodFP = function() {

	return function(req, res) {

		var now = new Date(),
				utcDateTime = new Date(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds()
				),
				timestamp = format('yyyyMMddhhmmss', utcDateTime);

		// Type 1 for retrieving token (authorisation)
		var buildString = config.merchant + '|' + config.password + '|1|';
		buildString += req.params.account_id + '|1.00|' + timestamp;

		var shasum = crypto.createHash('sha1');
		shasum.update(buildString);

		var responseObj = {
			ExceptionObject: {
				DeveloperMessage: null,
				UserMessage: null,
				ErrorCode: 0,
				MoreInfo: null
			},
			Token: req.params.token,
			DataObject: {
				Timestamp: timestamp,
				Fingerprint: shasum.digest('hex')
			}
		};

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Content-Length', JSON.stringify(responseObj).length);
		res.send(JSON.stringify(responseObj));

	};

};

/**
 * @name securepay.callback
 *
 * @description Updates Customers payment history with payment made via securepay
 */
exports.callback = function() {

	return function(req, res) {

		console.log(['Type', req.params.type]);

		console.log(req.body);

		var responseObj = {
			ExceptionObject: {
				DeveloperMessage: null,
				UserMessage: null,
				ErrorCode: 0,
				MoreInfo: null
			},
			DataObject: {
				result: 'Success'
			}
		};

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Content-Length', JSON.stringify(responseObj).length);
		res.send(JSON.stringify(responseObj));

	};

};


/**
 * @name securepay.paymentMethod
 *
 * @description Updates customers payment method
 */
exports.paymentMethod = function() {

	return function(req, res) {

		var responseObj = {
			ExceptionObject: {
				DeveloperMessage: null,
				UserMessage: 'Change to Payment Method Successful',
				ErrorCode: 0,
				MoreInfo: null
			},
			Token: req.params.token,
			DataObject: null
		};

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Content-Length', JSON.stringify(responseObj).length);
		res.send(JSON.stringify(responseObj));

	};

};
