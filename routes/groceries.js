let express = require('express');
let router = express.Router();
let Utils = require('../utils');
let utils = new Utils();
let Types = require('../mvc/model/types');
let types = new Types();
let Groceries = require('../mvc/model/groceries');
let groceries = new Groceries();
let Template = require('../templates');
let template = new Template();




/**
 * get types & grocery
 */
router.get('/',async (req,res)=>{
    if(req.session.loggedIn){
        //console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
        if(req.session.user.id){
            let liste; 
            //let tipi;
            //tipi = await types.getAll();
            liste = await groceries.getWhere('lg.user_id='+req.session.user.id);
            console.log("liste: ", liste);
        }
		
		template.myRender(res,'groceries2',['groceries'],{'types':false,'groceries':liste}, req.session.user);
    }
	else res.redirect('/login');
});


router.get('/add', async(req,res)=>{
	console.log("groceries/add ");
	//let spesa = await grocery.getWhere('g.id='+req.params.id);
	//let tipi = await types.getAll();
	//console.log(spesa,tipi);
	template.myRender(res, 'groceriesAdd', ['groceries'], false, req.session.user);
	
});



router.get('/:id', async(req,res)=>{
	console.log("groceries/id");
	//let spesa = await grocery.getWhere('g.id='+req.params.id);
	//let tipi = await types.getAll();
	//console.log(spesa,tipi);
	//template.myRender(res, 'grocery', ['groceries'], {'types':tipi,'groceries':spesa},req.session.user);
	
});



module.exports = router;
