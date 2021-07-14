let express = require('express');
let router = express.Router();
let Utils = require('../utils');
let utils = new Utils();
let Types = require('../mvc/model/types');
let types = new Types();
let Grocery = require('../mvc/model/grocerylist');
let grocery = new Grocery();
let Template = require('../templates');
let template = new Template();
/**
 * get types & grocery
 */
router.get('/',async (req,res)=>{
    if(req.user){
        console.log(" REQ USERS VEROOOOOOOOOOOOOOOOOOOOOOOOOO")
    }
    let rows,tipi;
	tipi = await types.getAll();
	rows = await grocery.getAll();

	template.myRender(res,'groceries',['grocery','list'],false,tipi,rows);
})

router.get('/list', async(req, res)=>{
	console.log('list');
})

router.get('/group', async(req, res)=>{
	console.log('list');
})

router.post('/', async (req,res)=>{
	console.log("post");
	console.log(req.body);
	
	//if(!(req.body.name && req.body.type_id)) res.render('home');
	if(!req.body.send)
    {
		var result = await grocery.add(req.body);
		console.log("RES ADD: ",result);
		if(result.insertId) res.redirect('home');
	}
	else if(req.body.send==='delete'){
		if(req.body.id){
            var result = await grocery.delete(req.body.id);
            console.log(result)
            if(result){
                res.redirect('/home');
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
		var result = grocery.updateBought({'bought':req.body.bought},req.body.id)
        if(result){
            res.redirect('/home');
        }
	}

});

router.get('/:id', async(req,res)=>{
	console.log("grocery/id");
	let spesa = await grocery.getWhere('g.id='+req.params.id);
	let tipi = await types.getAll();
	console.log(spesa,tipi);
	template.myRender(res, 'grocery', ['grocery'], false, tipi, spesa);
	//res.render(grocery.getIndexTemplate(),{login:0,filename:'home',links:['grocery list'],rows:spesa,types: tipi})
	
});


module.exports = router;
