const Database = require('./db');

/**
 * 
 */
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

    /**
     * 
     * @returns TBL value
     */
    getViewTable(){
        return this.getTblname();
    }
    /**
     * 
     * @param {*} name string TBL 
     */
    setTblname(name){
        this.TBL = name;
    }
    /**
     * 
     * @returns string TBLJOIN
     */
    getTblJoin(){
        return this.TBLJOIN;
    }
    /**
     * 
     * @param {*} tblJoin string TBLJOIN
     */
    setTblJoin(tblJoin){
        this.TBLJOIN = tblJoin;
    }

    /**
     * 
     * @returns string TBL name (if TBLJOIN setted: TBL + TBLJOIN)
     */
    getTblname(){
        return this.TBL;
    }

    getFullTblname(){
        if(this.TBLJOIN) return this.TBL+' '+this.TBLJOIN;
        else return this.TBL;
    }
    /**
     * 
     * @param {*} fields array or object
     */
    setFields(fields){
        this.fields = fields;
    }

    getFieldsArray(){
        return this.fields;
    }

    /**
     * 
     * @param {*} required boolean (Work in Progress)
     * @returns string fields or false
     */
    getFields(required=false){
        let fields='';
        console.log("getFields Entity: ", this.fields);
        if(this.fields){
            console.log("this.fields vera");
            for(var i in this.fields){
                /* console.log(i);
                console.log(this.fields[i].as); */
                fields += this.fields[i].as+' as '+"'"+i+"',";
                /* console.log("fff: ", fields); */
            }
            fields = fields.slice(0,-1);
        }
        else{
            console.log("ENTITY getFields fields false");
            return false;
        }
        //else fields = ' * ';
        return fields;
    }

    /**
     * Create sql and run query
     * @param {*} where String
     * @param {*} fields Object
     * @returns result of  query
     */
    async find(where=false, fields=false){
        var sql=this.queryString(this.getFullTblname(), 'SELECT', where, fields);
        //console.log("FIND ",sql);
        var rows = await this.doQuery(sql);
        console.log("FIND ENTITY ",rows);
        if(rows && rows[0].id) return rows
        //console.log("XXX",JSON.parse(JSON.stringify(rows)));
        return false;
    }

    async doQueryEntity(sql){
        var rows = await this.doQuery(sql);
        console.log("XXX",JSON.parse(JSON.stringify(rows)));
        return rows;
    }

    /**
     * getAll => call find()
     * @param {*} where string
     * @returns result of query
     */
    async getAll(where=false){    
        var sql = await this.find(where); //this.queryString(this.getFullTblname(), 'SELECT', (where) ? where : false);
        return sql;    
    }
    /**
     * 
     * @param {*} params 
     * @returns result of query
     */
    async insertQuery(params){
        var result = await this.insertQueryString_(params, this.getTblname());
        return result;
    }
    /**
     * 
     * @param {*} id fields
     * @returns false or result query 
     */
    async deleteFromId(id){
        if(!id) return false;

        var condition = ' id='+id;
        var result = await this._deleteQuery(condition,this.getTblname());
        return result;
    }
    /**
     * 
     * @param {*} params object
     * @param {*} where string
     * @returns result query
     */
    async update(params,where){
        var result = await this._updateQuery(this.getTblname(),params,where);
        //console.log(result);
        return result;
    }

};


module.exports = Entity;