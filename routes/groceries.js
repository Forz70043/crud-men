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
let ListGroup = require('../mvc/model/listgroup');
let listGroup = new ListGroup();
let Grocery = require('../mvc/model/grocerylist');
let grocery = new Grocery();



/**
 * get types & grocery
 */
router.get('/',async (req,res)=>{
    if(req.session.loggedIn){
        //console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
		let liste = false;
        if(req.session.user.id){
            //tipi = await types.getAll();
			if(req.session.user.role == 'admin') liste = await groceries.getAll();
			else liste = await groceries.getWhere('lg.user_id='+req.session.user.id);
        
			console.log("liste: ", liste);
        }
		
		template.myRender(res,'groceries2',['groceries'],{'types':false,'groceries':liste}, req.session.user);
    }
	else res.redirect('/login');
});


router.get('/add', async(req,res)=>{
	console.log("groceries/add ");
	if(req.session.loggedIn){
		//let spesa = await grocery.getWhere('g.id='+req.params.id);
		//let tipi = await types.getAll();
		console.log(req.session.user.id);
		template.myRender(res, 'groceriesAdd', ['groceries'], {'user_id': req.session.user.id}, req.session.user);
	}
	else res.redirect('/login');

});


router.post('/add', async (req,res)=>{
	console.log("post ADD");
	console.log(req.body);
	
	//if(!(req.body.name && req.body.type_id)) res.render('home');	
	if(req.body)
    {
		console.log("req.body >0");
		//groceries.startTransaction();
		var result = await groceries.add(req.body.name);
		console.log("RES ADD: ",result);
		let results = await listGroup.add({'grocery_grp_id':result.insertId, 'user_id':req.body.user_id});
		console.log("RES ADD: ",results);
		
		if(result && results){
			//template.myRender(res, 'groceries2', )
			res.redirect('/groceries');
		}
		if(results) return results; //true//groceries.commit();
		else return false;//groceries.rollback();
		
		
		
		if(results.insertId) res.redirect('home');
	}
	/*
	else if(req.body.send==='delete'){
		if(req.body.id){
            var result = await grocery.delete(req.body.id);
            console.log(result)
            if(result){
                res.redirect('/groceries');
            }
        }
	}
	else if(req.body.send==='update'){
		if(!req.body.bought){
			for(key in req.body){
				console.log(req.body[key]);
				console.log(key);
				if(key==='bought_'+req.body.id){
					req.body.bought=(req.body[key]==='on')?'yes':'no';
				}
			}
		}
		else{
			req.body.bought = (req.body.bought==='on'||req.body.bought==='yes' )?'yes':'no';
		}
		let params = (req.body.name && req.body.type_id) ? {'name':req.body.name,'type_id':req.body.type_id,'bought':req.body.bought} : {'bought':req.body.bought}; 
		//var result = grocery.updateBought(params,req.body.id)
        var result = grocery.updateGrocery(params,req.body.id)
		if(result){
            res.redirect('/groceries');
        }
	}
	*/
});

router.get('/:id', async(req,res)=>{
	console.log("groceries/id");
	let spesaGruppo = await grocery.getWhere('g.grocery_grp_id='+req.params.id); 
	//let spesa = await grocery.getWhere('g.id='+req.params.id);
	let tipi = await types.getAll();
	console.log(spesaGruppo);
	template.myRender(res, 'grocerieslist', ['groceries'], {'types':tipi,'groceries':spesaGruppo},req.session.user);
	
});

router.get('/:id/add', async(req, res)=>{
	console.log("req ",req);
	console.log("res: ", res);
})


module.exports = router;
