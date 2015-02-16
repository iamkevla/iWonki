module.exports = function(Person) {
	
	  Person.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }
     
    Person.remoteMethod(
        'greet', 
        {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'},
					http: {path: '/greet', verb: 'get'}
        }
    );

};
