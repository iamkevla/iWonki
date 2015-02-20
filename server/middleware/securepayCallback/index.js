
module.exports = function() {

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
