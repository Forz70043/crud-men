var express = require('express');
var router = express.Router();
let Utils = require('../utils');
var utils = new Utils();
var Types = require('../mvc/model/types');
var types = new Types();
var Grocery = require('../mvc/model/grocerylist');
var grocery = new Grocery();

/**
 * get types
 */
router.get('/',async (req,res)=>{
    let rows,tipi;
	tipi = await types.getAll();
	rows = await grocery.getAll();

	res.render(grocery.getIndexTemplate(),
        {
            login:0,
            filename: 'home',
            links: ['grocery list'],
            rows:rows,
            types:tipi
        }
    );

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
		database.updateGrocery([req.body.bought,req.body.id])
		.then((result)=>{
			console.log(result);
			res.redirect('home');
		})
		.catch((err)=>{
			console.log(err);
		})
	}

});

router.get('/:id',async(req,res)=>{
	console.log("home/id");

	console.log(req.body);
	
});


module.exports = router;
