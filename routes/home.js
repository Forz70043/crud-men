let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Users = require('../mvc/model/users');
let users = new Users();


router.get('/', (req,res)=>{
	console.log("req.sess: ",req.session);
	console.log("req.sess user: ",req.session.user);

	if(req.session.loggedIn && req.session.user) template.myRender(res,'dashboard',false,false,false,false,false,req.session.user);
	else res.redirect('/login');
})

router.get('/profile', async(req, res)=>{
	console.log('profile');
    console.log("RQ sess", req.session);


    if(req.session.loggedIn && req.session.user) template.myRender(res,'profile',false,false,false,false,false,req.session.user);
    else res.redirect('/login');
});

router.post('/profile', async(req, res)=>{
    console.log('profile');
    console.log("RQ sess", req.session);
    console.log("RQ sess", req.params);



})


module.exports = router;