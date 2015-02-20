
module.exports = function() {

	return function(req, res) {

		console.log(['Type', req.params.type]);

		console.log(req.body);
		res.send(201);

	};

};
