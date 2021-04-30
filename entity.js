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

    addToData(data){
        this.data.push(data);
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

    async find(where=false, fields=false){
        console.log("WHERE FIND: ",where);
        var sql=this.queryString(this.getTblname(),'SELECT',where,fields);
        //console.log("FIND ",sql);
        var rows = await this.doQuery(sql);
        console.log("XXX",JSON.parse(JSON.stringify(rows)));
        return rows;
    }

    /* getEntity(){
        console.log("")
        return new Promise((resolve, reject)=>{
            var sql = this.queryString(this.getTblname(),'SELECT');
            console.log("GET ENTITY ",sql);
        })
    } */

    async getAll(where=false){    
        var sql = this.queryString(this.getTblname(),'SELECT',(where)?where:false);
        return await this.doQuery(sql);         
    }
    
    async insertQuery(params){
        console.log("ENTITY INSERT QUERY: ",params)
        var result = await this._insertQuery(params,this.getTblname());
        //console.log("XXX ",result);
        return result;
    }

    async deleteFromId(id){
        var condition = 'WHERE id='+id;
        var result = await this._deleteQuery(condition,this.getTblname());
        return result;
    }

    async update(params,where){
        var result = await this._updateQuery(this.getTblname(),params,where);
        //console.log(result);
        return result;
    }

};


module.exports = Entity;