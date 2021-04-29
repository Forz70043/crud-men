const Database = require('./db');


class Entity extends Database{
    
    constructor(){
        super();
        this.TBL='';
        this.fields={};
        this.data=[];
    }

    setData(data){
        this.data=data;
    }

    getData(){
        return this.data;
    }

    setTblname(name){
        this.TBL = name;
    }

    getTblname(){
        return this.TBL;
    }

    setFields(fields){
        this.fields = fields;
    }

    getFields(required=false){
        var myFields = [];

        if(required){
            this.fields.filter((field)=>{
                console.log(field);
                if(field.required){
                    return field;
                }
            })
        }
        return this.fields;
    }


    async find(where=false){
        var sql=this.queryString(this.getTblname(),'SELECT',(where)?where:false);
        console.log("FIND ",sql);
        var rows = await this.doQuery(sql);
        console.log("XXX",rows);
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
        var sql = this.insertQueryString(this.getTblname(),params,this.getFields());

        var result = await this.doQuery(sql);
    }

}



module.exports = Entity;