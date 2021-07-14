let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Utils = require('../utils');
let utils = new Utils();


let Users = require('../mvc/model/users');
let users = new Users();

router.get('/',async (req,res)=>{
	let utenti = await users.getAll();
	template.myRender(res,'users',['users'],false,false,false,utenti);
})


router.get('/:id',async(req,res)=>{
	console.log("users/id");
	let user = await users.getWhere('u.id='+req.params.id);
	console.log(user);
	template.myRender(res,'user',['users'],false,false,false,user);
});


module.exports = router;
