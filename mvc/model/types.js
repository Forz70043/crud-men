const Entity = require('../../entity');

class Types extends Entity {
    constructor(){
        super();
        this.TBL= 'TYPE';
        this.setFields({
            'id':{
                as: 'id',
                required:true
            },
            'name':{
                as: 'name',
                required:true }
        });
    }

    async get(){
        return await this.getAll();
    }

    async getWhere(where=false){
        console.log("get where: ");
        let result = await this.find(where,this.getFields());
        console.log("GET where :", result);
        return result;
    }

    async getAll(){
        var result = await this.find();
        //console.log("GET ALL :",result);
        return result;
    } 

    async add(params){		
		console.log("TYPE ADD ",params);
		//console.log(Object.keys(params).length);

		var objKeys = Object.keys(params);
		if(objKeys.length>0){
			//console.log("params >0");
			var result = await this.insertQuery(params);
			//console.log(" ADD: ",result);
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