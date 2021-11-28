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
            if(parseInt(params.grocery_grp_id) && parseInt(params.user_id)){
                params = {'grocery_grp_id':parseInt(params.grocery_grp_id),'user_id':parseInt(params.user_id) }
			    var result = await this.insertQuery(params);
                console.log("result: ", result);
			    return result;
            }
		}
		else{
            //errori
            console.log("params <0");
            return {'result':false, 'errMsg': 'PARAMS LENGTH <= 0'};
        }
        return false;
    }

}


module.exports = ListGroup;
