const Entity = require('../../entity');


class Users extends Entity {
    constructor(){
        super();
        this.TBL='USERS';
        this.setFields({
            'id':{
                as: 'u.id',
                required:true },
            'name':{
                as: 'u.name',
                required:true },
            'surname':{ 
                as:'u.surname',
                required:true },
            'email': {
                as: 'u.bought',
                required: false },
            'password': {
                as: 'u.password',
                required: false },
            'phone': {
                as: 'u.cod_id',
                required: false },
            'role_id': {
                    as: 'u.role_id',
                    required: false },
            'address': {
                as: 'u.address',
                required: false },
            }
        );
    }

    async add(params){
        console.log("ADD USER: ",params);
        var objKeys = Object.keys(params);
		if(objKeys.length>0){
			console.log("params >0");
			var result = await this.insertQuery(params);
			console.log(" ADD: ",result);
			return result;
		}
		else console.log("params <0");    
    }

    async getFromCode(code){
        //console.log(code);
        var result = await this.find();
        //console.log("GET ALL :",result);
        return result;
    }

    async get(where){
        console.log("GET WHERE: ",where);
        var result = await this.find(where);
        //console.log("GET :",result);
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


module.exports = Users;