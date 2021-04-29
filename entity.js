const Database = require('./db');


class Entity extends Database{
    
    constructor(){
        super();
        this.TBL = '';
        this.TBLJOIN = ''
        this.fields={};
        this.data=[];
        this.data['indexTemplate']='index';    
    }

    getIndexTemplate(){
        return this.data.indexTemplate;
    }

    setData(data){
        this.data=data;
    }

    getData(){
        return this.data;
    }

    getViewTable(){
        if(this.TBLJOIN){
            //console.log(Object.getOwnPropertyNames(this));
            return this.TBL +=this.TBLJOIN;
        }
    }

    setTblname(name){
        this.TBL = name;
    }
    
    getTblJoin(){
        return this.TBLJOIN;
    }

    setTblJoin(tblJoin){
        this.TBLJOIN = tblJoin;
    }

    getTblname(){
        return this.TBL;
    }

    setFields(fields){
        this.fields = fields;
    }

    getFields(required=false){
        if(required){
            this.fields.filter((field)=>{
                if(field.required){
                    return field;
                }
            })
        }
        return Object.keys(this.fields);
    }

    /* async findWhere(where=false,fields=false){
        var sql = this.queryString(this.getTblname(),'SELECT',where,fields)
        console.log(sql)

        var rows = await this.doQuery(sql);
    } */

    async find(where=false, fields=false){
        var sql=this.queryString(this.getTblname(),'SELECT',where,fields);
        //console.log("FIND ",sql);
        var rows = await this.doQuery(sql);
        //console.log("XXX",rows);
        return rows;
    }

    /* getEntity(){
        console.log("")
        return new Promise((resolve, reject)=>{
            var sql = this.queryString(this.getTblname(),'SELECT');
            console.log("GET ENTITY ",sql);
        })
    } */

    getAll(where=false){
        return new Promise((resolve, reject)=>{
            var sql = this.queryString(this.getTblname(),'SELECT',(where)?where:false);
            console.log("GET ENTITY SQL: ",sql);
            this.doQuery(sql)
            .then((result)=>{
                //console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }

    async insertQuery(params){
        console.log("ENTITY INSERT QUERY: ",params)
        var result = await this._insertQuery(params,this.getTblname());
        console.log("XXX ",result);
        return result;
    }

    async deleteFromId(id){

        console.log(id);
        var condition = 'WHERE id='+id;
        var result = await this._deleteQuery(condition,this.getTblname());
        return result;
    }


};


module.exports = Entity;