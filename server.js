
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
var db;

//mongoConnection
MongoClient.connect('mongodb://127.0.0.1:27017',(err,client)=>{
	//start mongo server
	if(err) return console.log(err);
	db = client.db('crud-men');     //<= db 

	app.listen(process.env.PORT|| 3000, ()=>{
		console.log('listening on 3000');
	});
});

//temp engine
app.set('view engine', 'ejs');
//req from body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//view part
app.use(express.static(__dirname+'/public',{
	index: false,
	immutable: true,
	cacheControl: true,
	maxAge: "15g"
}));

/*
 * Req for request & res for response
 * get data
 */
app.get('/',(req,res)=>{
	//res.sendFile(__dirname+'/index.html');
	//var cursor = db.collection('quotes').find();   //<=NON UTILIZZO?
	db.collection('quotes').find().toArray(function(err,results){
		//console.log(results);
		if(err) return console.log(err);
		res.render('index.ejs',{quotes: results });
	});
});

//req save
app.post('/quotes', (req,res)=>{
	//collection().save()deprecated			<= !!!!!!!!!!!!!!!!!
	db.collection('quotes').save(req.body, (err,result)=>{
		if(err) return console.log(err);
		//console.log('saved into db');
		res.redirect('/');
	});
});

app.put('/quotes',(req,res)=>{
	db.collection('quotes').findOneAndUpdate({name: 'XXX Hi Guys'},{ 
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
			console.log(err);
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



