const Entity = require('../../entity');


class Grocery extends Entity {
    
    constructor(){
        super();
        this.TBL = 'GROCERY';
        this.TBLJOIN=' g LEFT JOIN TYPE t ON t.id=g.type_id';

        this.setFields({
            'id':{
                as: 'g.id',
                required:true
            },
            'name':{
                as: 'g.name',
                required:true },
            'type_id':{ 
                as:'g.type_id',
                required:true },
            'type':{ 
                as:'t.name',
                required:true },
            'bought': {
                as: 'g.bought',
                required: false } 
            }
        );
    }

    async getAll(){
        //var fields = ['g.id', 'g.name','g.type_id as type_id',' t.name as type', 'g.bought'];
        console.log("GROCERY FIELDS: ", this.getFields());

        var result = await this.find(false,this.getFields());
        console.log("GET ALL :", result);
        return result;
    }

    async getWhere(where=false){
        console.log("get where: ");
        let result = await this.find(where,this.getFields());
        console.log("GET where :", result);
        return result;
    }
   /*  getGrocery(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT g.id, g.name, g.type_id as type_id, t.name as type, g.bought FROM GROCERY g LEFT JOIN TYPE t ON t.id=g.type_id')
                .then((obj)=>{
                    //console.log(obj);
                    //console.log(JSON.parse(JSON.stringify(obj)));
                    resolve(obj);
                    resolve(JSON.parse(JSON.stringify(obj)));
                    //return JSON.parse(JSON.stringify(obj));
                })
                .catch((err)=>{
                    console.log(err);
                    reject(new Error(err));
                })
        });
    } */
    
    async add(params){
        params['bought'] = (params.bought==='on') ? 'yes' : 'no';
		var objKeys = Object.keys(params);

		if(objKeys.length>0){
			var result = await this.insertQuery(params);
			return result;
		}
		else{
            //errori
            console.log("params <0");
        }
	}

    async updateGrocery(params,where){
        console.log(params);
        console.log(where);
        var condition='id='+where;

        var result = await this.update(params,condition);
        console.log(result);
        return result;
    }

    async updateBought(params,where){
        console.log(params);
        console.log(where);
        var condition='id='+where;

        var result = await this.update(params,condition);
        console.log(result);
        return result;
    }

    async delete(params){
        console.log(params);
        if(params!=undefined){
            var result = await this.deleteFromId(params)
            return result;
        }
    }

};

module.exports = Grocery;