var builder = require('botbuilder');

module.exports = [
    function (session) {
		var idx;
		var num = session.userData.number;
		var flag = true;
		for( idx = 2; idx < (num/2); idx++ ) {
			if( (num % idx) == 0) {
				flag = false;
			}
		}
		if( flag ){
			session.send(' %d is prime!', num);
		} else {
			session.send(' %d is not prime :(', num );
		}
		session.userData.prime = flag;
	}
];