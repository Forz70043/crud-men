const Entity = require('../../entity');

class Types extends Entity {
    constructor(){
        super();
        this.TBL= 'TYPE';
        this.setFields({
            'id':{required:false},
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

    addType(params){
        console.log(params);

    }
    
    delete(params){

    }

};

module.exports = Types;