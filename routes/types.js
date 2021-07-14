var express = require('express');
var router = express.Router();
let Utils = require('../utils');
var utils = new Utils();
var Types = require('../mvc/model/types');
var types = new Types();

/**
 * get types
 */
router.get('/',async (req,res)=>{
	let tipi = await types.getAll();
	res.render(types.getIndexTemplate(),{login:0,filename:'types',links:['types'],types:tipi })
})


router.get('/:id',async(req,res)=>{
	console.log("types/id");
	let tipo = await types.getWhere('id='+req.params.id);
	console.log(tipo);
	res.render(types.getIndexTemplate(),{login:0,filename:'types',links:['types'],types:tipo })
});

router.post('/', async(req, res)=>{
    console.log(req.body);
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
	}
});


module.exports = router;
