var Entity = require('../../entity');

class GroceryGroup extends Entity {
    constructor(){
        super();
        this.TBL = 'GROCERY_GRP';
        this.fields = {
            'id':{},
            'name':{}
        }
    }

    get(){
        //var fields = ['g.id', 'g.name','g.type_id as type_id',' t.name as type', 'g.bought'];
        var result = await this.find(false,this.getFields());
        //console.log("GET ALL :",result);
        return result;
    }

    add(params){
        params['bought'] = (params.bought==='on') ? 'yes' : 'no';
		var objKeys = Object.keys(params);

		if(objKeys.length>0){
			var result = await this.insertQuery(params);
			return result;
		}
		else{
            //errori
            console.log("params <0");
        }
    }
};


modules.exports = GroceryGroup;