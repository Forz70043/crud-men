const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
//deprecato da express v>4.16
//const bodyParser = require('body-parser');
const mysql = require('mysql');
const Database = require('./db');
//const { data } = require('jquery');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//const GitHubStrategy = require('passport-github2').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var userProfile;
var database = new Database();
const app = express();

app.set('appName','Shopping List');
//template engine
app.set('view engine', 'ejs');

app.set('port',process.env.PORT);
app.set('templateIndex','index');

//req from body => body-parser included into express core from v>4.16
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

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


passport.serializeUser(function(user, cb) {
	cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});


passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
    	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    	callbackURL: process.env.GOOGLE_REDIRECT_URL//"http://localhost:3000/auth/google/"
	},
  	function(accessToken, refreshToken, profile, done) {
    	userProfile=profile;
      	return done(null, userProfile);
  	}
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_REDIRECT_url//"http://127.0.0.1:3000/auth/github/"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {
    userProfile = profile;  
	return done(null, userProfile);
    //});
  }
));

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/' //'/auth/facebook'//'return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


app.get('/login/google', 
	passport.authenticate('google', { scope : ['profile', 'email'] })
);

app.get('/auth/google', 
	passport.authenticate('google', { failureRedirect: '/error' }),
  	function(req, res) {
    	// Successful authentication, redirect success.
    	res.redirect('/success');
  	}
);
//richiesta per login
app.get('/login/github',
	passport.authenticate('github', { scope: [ 'user:email' ] }),
  	function(req, res){
    	// The request will be redirected to GitHub for authentication, so this
    	// function will not be called.
  	}
);
//richiesta call back dal server github
app.get('/auth/github', 
  	passport.authenticate('github', { failureRedirect: '/error' }),
  	function(req, res) {
    	res.redirect('/success');
  	}
);

app.get('/login/facebook',
  passport.authenticate('facebook'));
/*
app.get('/login/facebook',
	passport.authenticate('facebook', { scope: [ 'user:email' ] }),
  	function(req, res){
    	// The request will be redirected to Facebook for authentication, so this
    	// function will not be called.
  	}
);
*/
app.get('/auth/facebook', 
  	passport.authenticate('facebook', { failureRedirect: '/error' }),
  	function(req, res) {
    	res.redirect('/success');
  	}
);



app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

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

app.get('/home/:id',(req,res)=>{
	console.log("home/id");
	console.log(req.body);
	res.send("ok")
})


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

app.post('/types',(req,res)=>{
	console.log(req.body);
	let types;
	if(!req.body.send){
		database.addType(req.body.name)
		.then((result)=>{
			console.log(result);
			res.redirect('types');
		})
		.catch((err)=>{
			console.log(err);
		})
	}
	else if(req.body.send==='delete'){
		database.deleteType([req.body.id])
		.then((result)=>{
			console.log(result);
			res.redirect('types');
		})
		.catch((err)=>{
			console.log(err);
			return false;
		})
	}
})

//req save
app.post('/home', (req,res)=>{
	console.log("post");
	console.log(req.body);
	//console.log(res);
	//let rows,types;
	//if(!(req.body.name && req.body.type_id)) res.render('home');
	if(!req.body.send){
		database.addGrocery([req.body.name,req.body.type_id,(req.body.bought==='on')?'yes':'no'])
		.then((result)=>{
			console.log("result");
			console.log(result);
			res.redirect('home');
			//return database.getGrocery();
		})
		.catch((err)=>{
			console.log(new Error(err));
			return false;
		})
	}
	else if(req.body.send==='delete'){
		database.deleteGrocery([req.body.id])
		.then((result)=>{
			console.log(result);
			res.redirect('home');
			//return res.render(app.get('templateIndex'),{login:0,filename: 'home',links: ['grocery list'],rows:rows,types:types});
			//return database.getGrocery();
		})
		.catch((err)=>{
			console.log(err);
			return false;
		})
	}
	else if(req.body.send==='update'){
		if(!req.body.bought){
			for(key in req.body){
				console.log(req.body[key]);
				console.log(key);
				if(key==='bought_'+req.body.id){
					req.body.bought=(req.body[key]==='on')?'yes':'no';
				}
			}
		}
		database.updateGrocery([req.body.bought,req.body.id])
		.then((result)=>{
			console.log(result);
			res.redirect('home');
		})
		.catch((err)=>{
			console.log(err);
		})
	}

	/*database.addGrocery([req.body.name,req.body.type_id,(req.body.bought==='on')?'yes':'no'])
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
	*/

});

app.get('/auth/google', (req,res)=>{
	console.log("request");console.log(req);

	console.log("response"); console.log(res);
})

app.post('/auth/google', (req,res)=>{
	console.log("post");
	console.log("request");console.log(req);

	console.log("response"); console.log(res);
})


app.get('/auth/github', (req,res)=>{
	console.log("request");console.log(req);

	console.log("response"); console.log(res);
})

app.post('/auth/github', (req,res)=>{
	console.log("post");
	console.log("request");console.log(req);

	console.log("response"); console.log(res);

})


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

app.delete('/types',(req,res)=>{
	console.log("types delete");
	console.log(req.body);
	//let rows, types;

	database.deleteType([req.body.id])
	.then((result)=>{
		console.log(result);
		
		return res.render(app.get('templateIndex'),{login:0,filename: 'types',links: ['tipi'],rows:rows,types:types});
		//return database.getGrocery();
	})
	.catch((err)=>{
		console.log(err);
		return false;
	})
})



module.exports = app.listen(process.env.PORT,function(){
	console.log(`app listen on: http://localhost:${process.env.PORT}`);
});
