const Entity = require('../../entity');

class ListGroup extends Entity {

    constructor(){
        super();
        this.TBL = 'LIST_GROUP ';
        this.TBLJOIN = 'lg LEFT JOIN GROCERY_GRP grp ON lg.grocery_grp_id=grp.id LEFT JOIN USERS u ON u.id=lg.user_id ';

        this.setFields({
            'user_id':{
                as: 'lg.user_id',
                required:true 
            },
            'name':{
                as: 'grp.name',
                required:true 
            },
            'user':{
                as: "CONCAT(u.name,' ',u.surname)",
                required:true
            }
        });    
    }


    async getAll(){
        //var fields = ['g.id', 'g.name','g.type_id as type_id',' t.name as type', 'g.bought'];
        //console.log("GROCERY FIELDS: ", this.getFields());

        var result = await this.find(false,this.getFields());
        //console.log("GET ALL :", result);
        return result;
    }

    async getWhere(where=false){
        console.log("get where: ");
        let result = await this.find(where,this.getFields());
        //console.log("GET where :", result);
        return result;
    }


    async add(params){
        console.log("ADD params: ", params);
        var objKeys = Object.keys(params);

		if(objKeys.length>0){
			var result = await this.insertQuery(params);
            console.log("result: ", result);
            
			return result;
		}
		else{
            //errori
            console.log("params <0");
        }
    }

}


module.exports = ListGroup;
