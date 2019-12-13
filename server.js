
const express = require('express');

const app = express();

/*
 * Req for request & res for response
 */
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});



//ES6
app.listen(3000,()=>{
	console.log('listening 3000');
});

/* ES5
app.listen(3000, function(){
	console.log('listening 3000');
});
*/

