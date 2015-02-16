module.exports = function(Owing) {
	
	  Owing.findById = function(id, cb) {
			console.log(['here', id]);
      cb(null, 100);
    };
     
};
