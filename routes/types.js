let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Utils = require('../utils');
let utils = new Utils();

let Types = require('../mvc/model/types');
let types = new Types();

/**
 * get types
 */
router.get('/',async (req,res)=>{
	if(req.session.loggedIn){
        console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
		let tipi = await types.getAll();
		template.myRender(res,'types',['types'],false,tipi,false,false,req.session.user);
	}
	else res.redirect('/login');
})


router.get('/:id',async(req,res)=>{
	console.log("types/id");
	if(req.session.loggedIn){        
		console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")

		let tipo = await types.getWhere('id='+req.params.id);
		console.log(tipo);
		template.myRender(res,'type',['types'],false,tipo,false,false,req.session.user);
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
