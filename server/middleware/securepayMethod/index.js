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
