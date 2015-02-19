var crypto = require('crypto'),
		shasum = crypto.createHash('sha1');

module.exports = function() {
	
	return function(req, res) {
	
		console.log(req.params.account_id, req.params.token);
		
		var timestamp = "20110620123505"
		var buildString = "PPT0135|LyjA8Y93|1|NEWACCOUNT|1.00|"+ timestamp; 
		shasum.update(buildString);
		
		
		res.json(shasum.digest('hex'));
		 
	};

};
