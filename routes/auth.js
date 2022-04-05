var express = require('express');
var router = express.Router();
var Auth = require('../mvc/model/auth');
var GitHub = new Auth('github');
var Google = new Auth('google');
var Facebook = new Auth('facebook');

//risposta da google
router.get('/google', 
	Google.authenticateCallBack(),
  	function(req, res) {
		console.log("GOOGLE AUTH: ",req.user)  
		req.session.loggedIn = true;
		req.session.user = req.user;
		//console.log(req.user); 
		//console.log(res);
		// Successful authentication, redirect success.
    	res.redirect('/home');
  	}
);

//richiesta call back dal server github
router.get('/github', 
  	GitHub.authenticateCallBack(),
  	function(req, res) {
		console.log("GITHUB AUTH USER: ",req.user);
		req.session.loggedIn = true;
		req.session.user = req.user;
		res.redirect('/home');
  	}
);
//FB callback
router.get('/facebook', Facebook.authenticateCallBack(),
  	function(req, res) {
		//console.log(req.user)
    	res.redirect('/home');
  	}
);

module.exports = router;
