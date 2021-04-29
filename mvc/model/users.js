const Entity = require('../../entity');


class Users extends Entity {
    constructor(){
        super();
        this.TBL='USERS';
    }


    getUsers(){
        return new Promise((resolve, reject)=>{
            databases.doQuery("SELECT * FROM "+this.getTblname()+" ")
            .then((result)=>{
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                console.log(new Error(err));
                reject(err);
            })
        })
    }

    addUser($params){
        return new Promise((resolve, reject)=>{
            databases.doQuery("INSERT INTO "+this.getTblname)
        })
    }

}


module.exports = Users;