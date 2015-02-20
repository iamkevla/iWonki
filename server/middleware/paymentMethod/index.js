
module.exports = function() {

	return function(req, res) {

		var responseObj = {
			ExceptionObject: {
				"DeveloperMessage": null,
				"UserMessage": null,
				"ErrorCode": 0,
				"MoreInfo": null
			},
			"Token":req.params.token,
			"DataObject": null
		};
		
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Content-Length', JSON.stringify(responseObj).length);
		res.send(JSON.stringify(responseObj));

	};

};
