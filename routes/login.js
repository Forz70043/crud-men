var express = require('express');
var router = express.Router();
let Utils = require('../utils');
var Auth = require('../mvc/model/auth');
var GitHub = new Auth('github');
var Google = new Auth('google');
var Facebook = new Auth('facebook');

//richiesta per login github
router.get('/github', GitHub.authenticate(),
  	function(req, res){
    	// The request will be redirected to GitHub for authentication, so this
    	// function will not be called.
  	}
);


//richiesta per google
router.get('/google', Google.authenticate());

//login fb
router.get('/facebook', Facebook.authenticate('facebook'));
/*
router.get('/login/facebook',
	passport.authenticate('facebook', { scope: [ 'user:email' ] }),
  	function(req, res){
    	// The request will be redirected to Facebook for authentication, so this
    	// function will not be called.
  	}
);
*/

module.exports = router;
