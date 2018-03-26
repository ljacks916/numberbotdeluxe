var builder = require('botbuilder');
var counter;
var res;

function reverseAndAdd( num ) {
	console.log( 'rev %d and add', num);
	var numStr = num.toString();
	if( num < 10) { numStr = "0" + numStr;}
	var revNum = numStr.split("").reverse().join("");
	revNum = parseInt( revNum, 10 );	
	console.log( 'revnum check: %d', revNum );
	if( revNum == num && counter > 0){
		console.log(num + " vs " + revNum);
		res = num;
		return 1;
	} else if ( counter > 25) { return 0;}
	counter++;	
	reverseAndAdd(num + revNum);
}

module.exports = [
    function (session) {
		var num = session.userData.number;
		res = 0;
		counter = 0;
		if ( num != 196) {
			reverseAndAdd( num );
			console.log( res );
        	session.send('%d is palindrome after %d iterations and is shown as %d', num, counter, res );
		} else {
            session.send('%d is a suspected lychrel number, please dont break the bot', num);
		}
		session.userData.lychrel = res;
	}
];