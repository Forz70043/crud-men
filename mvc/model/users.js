const Entity = require('../../entity');


class Users extends Entity {
    constructor(){
        super();
        this.TBL='USERS';
        this.TBLJOIN = 'u ';
        
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
                as: 'u.email',
                required: false },
            'password': {
                as: 'u.password',
                required: false },
            'phone': {
                as: 'u.phone',
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
    /**
     * 
     * @returns Users result query
     */
    async getAll(){
        var result = await this.find();
        //console.log("GET ALL :",result);
        return result;
    } 

    /**
     * 
     * @param {object} params {param1:value1, param2: value2} 
     * @returns result of query
     */
    async add(params){
       /*  console.log("ADD USER: ",params); */
        var objKeys = Object.keys(params);
		if(objKeys.length>0){
			/* console.log("params >0"); */
			var result = await this.insertQuery(params);
			/* console.log(" ADD: ",result); */
			return result;
		}
		else {
            console.log("params length<0");
            return false;
        }    
    }

    async getFromCode(code){
        //console.log(code);
        var result = await this.find();
        //console.log("GET ALL :",result);
        return result;
    }
    /**
     * 
     * @param {*} where string
     * @returns result of query
     */
    async get(where){
        /* console.log("GET WHERE: ",where); */
        var result = await this.find(where);
        //console.log("GET :",result);
        return result;
    }

    /**
     * Call find with this.getFields()
     * @param {*} where string
     * @returns result wquery
     */
    async getWhere(where=false){
        /* console.log("get where: "); */
        let result = await this.find(where,this.getFields());
        
        return result;
    }
}


module.exports = Users;