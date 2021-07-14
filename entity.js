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

    setFields(fields){
        this.fields = fields;
    }

    /**
     * 
     * @param {boolean} required 
     * @returns string fields
     */
    getFields(required=false){
        let fields='';
        console.log("getFields Entity: ", this.fields);
        if(this.fields){
            console.log("this.fields vera");
            for(var i in this.fields){
                console.log(i);
                console.log(this.fields[i].as);
                fields += this.fields[i].as+' as '+"'"+i+"',";
                console.log("fff: ", fields);
            }
            fields = fields.slice(0,-1);
        }
        else fields = ' * ';
    
        return fields;
    }

    /**
     * 
     * @param {String} where 
     * @param {Object} fields 
     * @returns 
     */
    async find(where=false, fields=false){
        console.log("WHERE FIND: ",where);
        console.log("where fields: ",fields);
        var sql=this.queryString(this.getFullTblname(), 'SELECT', where, fields);
        console.log("FIND ",sql);
        var rows = await this.doQuery(sql);
        console.log("XXX",JSON.parse(JSON.stringify(rows)));
        return rows;
    }

    async getAll(where=false){    
        var sql = this.queryString(this.getFullTblname(), 'SELECT', (where) ? where : false);
        return await this.doQuery(sql);         
    }
    /**
     * 
     * @param {*} params 
     * @returns 
     */
    async insertQuery(params){
        console.log("ENTITY INSERT QUERY: ",params)
        
        var result = await this.insertQueryString_(params, this.getTblname());
        
        //console.log("SQL: ",sql);
        //var result = await this.doQuery(sql,);
        console.log("XXX ",result);
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