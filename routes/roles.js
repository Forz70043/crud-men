let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Utils = require('../utils');
let utils = new Utils();


let Roles = require('../mvc/model/role');
let roles = new Roles();



/**
 * get roles
 */
router.get('/', async (req,res)=>{
    if(req.session.loggedIn){
        console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
        let ruoli = await roles.get();
        template.myRender(res,'roles',['roles'],{'roles':ruoli}, req.session.user);
    }
    else res.redirect('/login');
})


router.get('/:id', async(req,res)=>{
	console.log("types/id");
	if(req.session.loggedIn){        
		console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log("Aggiungere elenco users con quel ruolo");
		let role = await roles.getWhere('id='+req.params.id);
		console.log(role);
		template.myRender(res,'role',['roles'],{'roles':role},req.session.user);
	}
	else res.redirect('/login');
});

router.post('/', async(req, res)=>{
    console.log("post");
	console.log(req.body);
	console.log("types");
	var params = req.body;
	console.log(params);
	if(!req.body.send){
		var result = await types.add(params);
		if(result.insertId){
			res.redirect('types');
		}
	}
	else if(req.body.send==='delete'){
        console.log("DELETE")
        console.log(req.body);
		var result = await types.delete(req.body.id);
		console.log("DEL RES: ",result);
        if(result.serverStatus==2){
            res.redirect('types');
        }
	}else if(req.body.send==='update'){
		console.log("UPDTE")
		console.log(params);
		let result = await types.updateType({name:params.name},req.body.id);
		if(result){
			res.redirect('/types/'+params.id);
		}
	}
});


module.exports = router;
