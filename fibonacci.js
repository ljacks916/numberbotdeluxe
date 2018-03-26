var builder = require('botbuilder');
var fibList = [0,1,1,2,3,5,8,13,21,34,55,89,144,233];

module.exports = [
    function (session) {        
		var num = session.userData.number;
		var idx;
		for( idx = 0; idx < fibList.length; idx++){
			if( fibList[idx] > num){
				session.userData.fib = false;
				session.send(' %d is not a Fibanocci number, its closests neighbors are %d and %d', num, fibList[idx-1], fibList[idx]);
                break;
			}
			else if( fibList[idx] == num){
				session.userData.fib = true;
                session.send('%d is a Fibanocci number, you have chosen well!', num);
                break;
			}
		}
	}
];	