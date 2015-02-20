/*jshint camelcase:false  */

var crypto = require('crypto'),
		format = require('date-format'),
		config = require('./config.json');

module.exports = function() {

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
		// TODO: move this into config file
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
