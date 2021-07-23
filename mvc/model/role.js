var Entity = require('../../entity');

class Role extends Entity {
    constructor(){
        super();
        this.TBL='ROLE';
        this.setFields({
            'id':{
                as: 'u.id',
                required:true },
            'name':{
                as: 'u.name',
                required:true },
            }
        );
    }

    async get(){
        var result = await this.find(false,false);
        //console.log("GET ALL :",result);
        return result;
    }

    async getWhere(where){
        let result = await this.find(where);
        return result;
    }

    async getRole(role_id){
        let role = await this.find('role_id='+role_id)
        if(role){    return role.name;}
        else return false
    }

    async getRoleCountUsers(){
        let result = await this.doQueryEntity('SELECT COUNT(u.surname) as n_users, r.name as name FROM USERS u LEFT JOIN ROLE r ON r.id=u.role_id group by name');
        if(result){
            return result;
        }
        else return false;
    }

    async add(params){

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