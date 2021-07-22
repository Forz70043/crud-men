let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Utils = require('../utils');
let utils = new Utils();


let Users = require('../mvc/model/users');
let users = new Users();

router.get('/',async (req,res)=>{
	if(req.session.loggedIn){
		let utenti = await users.getAll();
		template.myRender(res,'users',['users'],false,false,false,utenti,req.session.user);
	}
	else res.redirect('/login');
})


router.get('/:id',async(req,res)=>{
	console.log("users/id");
	let user = await users.getWhere('u.id='+req.params.id);
	console.log(user);
	template.myRender(res,'user',['users'],false,false,false,user,req.session.user);
});


router.post('/', async (req,res)=>{
	console.log("post");
	console.log(req.body);
	
	//if(!(req.body.name && req.body.type_id)) res.render('home');
	if(!req.body.send)
    {
		var result = await users.add(req.body);
		console.log("RES ADD: ",result);
		if(result.insertId) res.redirect('home');
	}
	else if(req.body.send==='delete'){
		if(req.body.id){
            var result = await users.delete(req.body.id);
            console.log(result)
            if(result){
                res.redirect('/home');
            }
        }
	}
	else if(req.body.send==='update'){
		/* if(!req.body.bought){
			for(key in req.body){
				console.log(req.body[key]);
				console.log(key);
				if(key==='bought_'+req.body.id){
					req.body.bought=(req.body[key]==='on')?'yes':'no';
				}
			}
		}
		var result = grocery.updateBought({'bought':req.body.bought},req.body.id)
        if(result){
            res.redirect('/home');
        } */
	}

});


module.exports = router;
