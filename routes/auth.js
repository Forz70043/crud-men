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
		console.log(req,res);
		// Successful authentication, redirect success.
    	res.redirect('/success');
  	}
);

//richiesta call back dal server github
router.get('/github', 
  	GitHub.authenticateCallBack(),
  	function(req, res) {
		//console.log("REQ: ",req);
		//console.log("RES: ",res.query,res.rawHeaders);
    	res.redirect('/success');
  	}
);

router.get('/facebook', Facebook.authenticateCallBack(),
  	function(req, res) {
		console.log(req)
    	res.redirect('/success');
  	}
);

module.exports = router;
