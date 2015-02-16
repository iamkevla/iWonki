module.exports = function(Owing) {
	
	  Owing.find = function(msg, cb) {
			console.log('here');
      cb(null, 100);
    };
     
};
