const { isNumeric } = require('jquery');
const Entity = require('../../entity');

class Types extends Entity {
    constructor(){
        super();
        this.TBL= 'TYPE';
        this.setFields({
            'name':{required:true}
        });
    }

    get(){
        this.getEntity()
        .then((result)=>{    
            return result;
        })
        .catch((err)=>{
            return err;
        })
    }

    async getAll(){
        var result = await this.find();
        console.log("GET ALL :",result);
        return result;
    } 

    async add(params){		
		console.log(" ADD ",params);
		console.log(Object.keys(params).length);

		var objKeys = Object.keys(params);
		if(objKeys.length>0){
			console.log("params >0");
			var result = await this.insertQuery(params);
			console.log(" ADD: ",result);
			return result;
		}
		else console.log("params <0");
	}

    async delete(params){
        console.log("DEL: ",params);
        if(params!=undefined){
            var result = await this.deleteFromId(params)
            return result;
        }
    }

    update(params){
        console.log("UPD: ",params);

    }

};

module.exports = Types;