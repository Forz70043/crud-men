const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
//deprecato da express v>4.16
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Database = require('./db');
const { data } = require('jquery');
//console.log(Database);
var database = new Database();

const app = express();

app.set('appName','crud-men');
//template engine
app.set('view engine', 'ejs');

app.set('port',process.env.PORT);
app.set('templateIndex','index');

//req from body => body-parser included into express core from v>4.16
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//servers static files js,css
app.use('/public',express.static(path.join(__dirname, 'public/css')));
app.use('/public',express.static(path.join(__dirname, 'public/js')));
app.use('/public',express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

/*
 * Req for request & res for response
 * get data
 */
app.get('/',function(req,res){
	//inserire logica se già auth
	res.render(app.get('templateIndex'),{login: 1,links: ['home']});
});

app.get('/home',function(req,res){
	let rows,types;
	database.getGrocery()
	.then((obj)=>{
		rows=obj;
		return database.getTypes();
	})
	.then((obj)=>{
		types=obj;
		res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types});
	})/*.then(()=>{
		console.log("chiudo db");
		console.log(rows,types);
		res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types,results:false } );
	})*/
	.catch((err)=>{
		console.log(err);
		return false;
	})

});

app.get('/types', (req,res)=>{
	let types;
	database.getTypes()
	.then((obj)=>{
		types = obj;
		res.render(app.get('templateIndex'),{login:0,filename:'types',links:['type'],types:types })
	})
	.catch((err)=>{
		console.log(err);
		return false;
	})

})

//req save

app.post('/home', (req,res)=>{
	console.log(req.body);
	//console.log(res);
	let rows,types;

	database.insertGrocery([req.body.name,req.body.type_id,(req.body.bought==='on')?'yes':'no'])
	.then((result)=>{
		console.log("result");
		console.log(result);
		return database.getGrocery();
	})
	.then((obj)=>{
		rows = obj;
		return database.getTypes();
	})
	.then((obj)=>{
		types = obj;
		res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types});
	})
	.catch((err)=>{
		console.log(new Error(err));
		return false;
	})

});

app.delete('/home', (req,res)=>{
	console.log("home delete");
	console.log(req.body);
	let rows, types;

	database.deleteGrocery([req.body.id])
	.then((result)=>{
		console.log(result);
		
		return res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types});
		//return database.getGrocery();
	})/*
	.then((obj)=>{
		rows = obj;
		return database.getTypes();
	})
	.then((obj)=>{
		types = obj;
		console.log("ZZZZZ");
		return res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types});
		console.log("XXXXXXXXXXX");
	})*/
	.catch((err)=>{
		console.log(err);
		return false;
	})

})


/*
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
*/
/*
app.delete('/quotes',(req,res)=>{
	db.collection('quotes').findOneAndDelete({name: req.body.name},(err,result)=>{
		if(err){
			console.log(err);  //<==
			return res.send(500,err);
		} 
		res.send('deleted');
	});
});
*/

module.exports = app.listen(process.env.PORT,function(){
	console.log(`app listen on: http://localhost:${process.env.PORT}`);
});
