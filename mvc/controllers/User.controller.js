let user = require('../model/users'); 
let users = new user();

class User extends user {
    constructor(){
        super();
    }

    getFields(){
        console.log("fields: ",this.fields);
        return this.fields;
    }

    sanitizeYearOfBirth(date){
        let data = new Date(date);
        return data.getFullYear()+'-'+data.getMonth()+'-'+data.getDate()+'';
    }

    async addUser(params){
        console.log("params",params)
        modelUser = await this.add(params);
        console.log(modelUser);
    }

    async getUsers(){
        let client = await this.getAll();
        let sanitizeUsers = client.map((user)=>{
            user.yearOfBirth = sanitizeYearOfBirth(user.yearOfBirth)
            return user;
        });
        console.log(sanitizeUsers);
        return sanitizeUsers
    }

    async getUserFromId(id){
        let u = await this.getWhere('u.id='+id);
        if(u){
            console.log("user: ",u);
        }
        return u;
    }
    

}

module.exports = User;