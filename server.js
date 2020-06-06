
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mysql = require('mysql');
const app = express();
const port=3000;
var db;
var connection = mysql.createConnection({
	host:'localhost',
	user:'forz',
	password:'x1y2z3t4e5',
	database:'AMBROGIO'
});

connection.connect(function(err){
	if(err) throw err;
	console.log("Connected");
	app.listen(process.env.PORT || 3000,function(){
		console.log("app listen on 3000");
	});
});
//mongoConnection
/*MongoClient.connect('mongodb://127.0.0.1:27017',{useUnifiedTopology: true},(err,client)=>{
	//start mongo server
	if(err) return console.log(err);
	db = client.db('crud-men');     //<= db 

	app.listen(process.env.PORT|| 3000, ()=>{
		console.log('listening on 3000');
	});
});
*/


//template engine
app.set('view engine', 'ejs');

//req from body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//view part
/*app.use(express.static(__dirname+'/public',{
	index: false,
	immutable: true,
	cacheControl: true,
	maxAge: "15g"
}));
*/
app.use(express.static('public'));

/*
 * Req for request & res for response
 * get data
 */
app.get('/',function(req,res){
/*	db.collection('quotes').find().toArray(function(err,results){
		//console.log(results);
		if(err) return console.log(err);
		res.render('index.ejs',{quotes: results });
	});
*/
	connection.query("SELECT * FROM SYSLOG",function(err,result){
		if(err) throw err;
		console.log(result);
		obj = {quotes:result};
		res.render('index.ejs',obj);
	});
});

//req save
app.post('/quotes', (req,res)=>{
	db.collection('quotes').insertOne(req.body,(err,result)=>{
			if(err) return console.log(err);
			res.redirect('/');
	});	
});

app.put('/quotes',(req,res)=>{
	db.collection('quotes').findOneAndUpdate({name: 'XXX Hi MotherFucker I\'ll kill you!'},{ 
		$set:
			{ 
			  name: req.body.name,
			  quote: req.body.quote
			}
		},
		{ sort: {_id: -1},
		  upsert: true
		},(err,result)=>{
			if(err) return res.send(err);
			res.send(result);
		});
});

app.delete('/quotes',(req,res)=>{
	db.collection('quotes').findOneAndDelete({name: req.body.name},(err,result)=>{
		if(err){
			console.log(err);  //<==
			return res.send(500,err);
		} 
		res.send('deleted');
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



