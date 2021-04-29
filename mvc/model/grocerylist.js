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
            'bought': {
                as: 'g.bought',
                required: false } 
            }
        );
    }

    async getAll(){
        //var fields = ['g.id', 'g.name','g.type_id as type_id',' t.name as type', 'g.bought'];
        var result = await this.find(false,this.getFields());
        //console.log("GET ALL :",result);
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

    async update(params){

    }

    async delete(params){
        console.log(params);
        if(params!=undefined){
            var result = await this.deleteFromId(params)
            return result;
        }
    }

    addGrocery(values){
        
        if(values===false || values.length<3) return new Error("No values sended");

        return new Promise((resolve, reject)=>{
            this.doQuery("INSERT INTO "+this.TBL+"(name,type_id,bought) VALUES (?,?,?)", values)
            .then((result)=>{
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                console.log(err);
                reject(new Error(err));
            })
        })
    }
    
    deleteGrocery(values){
        console.log("values");
        console.log(values);
        if(!values) reject(new Error('DB Delete Error: values not defined'));

        return new Promise((resolve, reject)=>{
            this.doQuery('DELETE FROM '+this.TBL+' WHERE id IN (?)',values)
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

    updateGrocery(values){
        console.log("update");
        console.log(values);
        return new Promise((resolve, reject)=>{
            this.doQuery('update GROCERY SET bought=? WHERE id IN (?)',values)
            .then((result)=>{
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }

};

module.exports = Grocery;