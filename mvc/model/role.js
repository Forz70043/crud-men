var Entity = require('../../entity');

class Role extends Entity {
    constructor(){
        super();
        this.TBL='ROLE';
        this.fields={'name':{}};
    }

    async get(){
        var result = await this.find(false,false);
        //console.log("GET ALL :",result);
        return result;
    }

    async add(params){
        //console.log(" ADD ",params);
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

}

module.exports = Role;