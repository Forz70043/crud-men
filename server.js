const env = require('dotenv').config();
const express = require('express');
const path = require('path');

const Database = require('./db');
var database = new Database();

var typesRouter = require('./routes/types');
var groceryRoute = require('./routes/grocery');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var Types = require('./mvc/model/types');
var types = new Types();

console.log(Object.getOwnPropertyNames(types));

var Grocery = require('./mvc/model/grocerylist');
const { access } = require('fs');
var grocery = new Grocery();

var userProfile;

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


/**
 * 	servers static files js,css
 */
app.use('/public',express.static(path.join(__dirname, 'public/css')));
app.use('/public',express.static(path.join(__dirname, 'public/js')));
app.use('/public',express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));


/**
 * ROUTES
 */
app.use('/types', typesRouter);
app.use('/home', groceryRoute);





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
    
	console.log(accessToken, refreshToken)
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

//richiesta per google
app.get('/login/google', 
	passport.authenticate('google', { scope : ['profile', 'email'] })
);
//risposta da google
app.get('/auth/google', 
	passport.authenticate('google', { failureRedirect: '/error' }),
  	function(req, res) {
		console.log(req,res);
		// Successful authentication, redirect success.
    	res.redirect('/success');
  	}
);
//richiesta per login github
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
		console.log("REQ: ",req);
		  console.log("RES: ",res.query,res.rawHeaders);
    	res.redirect('/success');
  	}
);
//login fb
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
		  console.log(req)
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
	res.render(app.get('templateIndex'),{login: 1, filename:false, links: false/*['home']*/});
});






app.listen(process.env.PORT,function(){
	console.log(`app listen on: http://localhost:${process.env.PORT}`);
});



module.exports = app;
