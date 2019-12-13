
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
var db;

app.set('view engine', 'ejs');

//req from body
app.use(bodyParser.urlencoded({extended: true}));

//mongoConnection
MongoClient.connect('mongodb://127.0.0.1:27017',(err,client)=>{
	//start mongo server
	if(err) return console.log(err);
	db = client.db('crud-men');     //<= db 

	app.listen(3000, ()=>{
		console.log('listening on 3k');
	});
});

/*
 * Req for request & res for response
 */
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
	var cursor = db.collection('quotes').find();
	db.collection('quotes').find().toArray(function(err,results){
		console.log(results);
	});
});

//for req
app.post('/quotes', (req,res)=>{
	//console.log(req.body);
	//collection().save()deprecated			<= !!!!!!!!!!!!!!!!!
	db.collection('quotes').save(req.body, (err,result)=>{
		if(err) return console.log(err);

		console.log('saved into db');
		res.redirect('/');
	});
});

//ES6
//app.listen(3000,()=>{
//	console.log('listening 3000');
//});

/* ES5
app.listen(3000, function(){
	console.log('listening 3000');
});
*/



