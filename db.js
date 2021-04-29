const env = require('dotenv').config();
const mysql = require('mysql');

/* Promisify DB */
class Database {

    constructor(){
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: 3306
        });
    }

    startTransaction(){
        return new Promise((resolve, reject)=>{
            this.connection.query("START TRANSACTION",(err, result)=>{
                if(err) reject(new Error(err));
                
                console.log(result);
                resolve(result);
            })
        })
    }

    commit(){
        return new Promise((resolve, reject)=>{
            this.connection.query("COMMIT",(err, result)=>{
                if(err) reject(new Error(err));

                console.log(result);
                resolve(result);
            })
        })
    }

    rollBack(){
        return newPromise((resolve, reject)=>{
            this.connection.query("ROLLBACK",(err, result)=>{
                if(err) reject(new Error(err));

                console.log(result);
                resolve(result);
            })
        })
    }

    /**
     * 
     * @param {string sql} sql 
     * @param {* array [ value, value2, value3,..]} args 
     * @returns result query
     */
    doQuery(sql, args){
        return new Promise((resolve, reject)=>{
            this.connection.query(sql, args, (err, rows, fields)=>{
                console.log("DB SQL: ",sql);
                if(err){
                    if(err.errno==1451){//errore di foreign key
                        reject("Error: Assicurati di cancellare prima gli Elementi con questo tipo")
                    }
                    if(err.errno==1054){
                        //errore di fields nella query
                    }
                    console.log("DB ERR: ",err);
                    reject(new Error(err));
                }
                resolve(rows);
            });
        });
    }

    close(){
        return new Promise((resolve,reject)=>{
            this.connection.end((err)=>{
                if(err) reject(new Error(err));
                resolve();
            });
        });
    }

    checkOpWhereConditions(op,value=false){
        if(typeof(op)==='string'){
            var sql ='';
            switch(op){
                case '=':
                    sql += ' =';
                    break;
                case 'LIKE':
                    if(value!=false){
                        sql +=' LIKE %'+value+'% ';
                    }
                    sql +=' LIKE %';
                    break;
                case '>':
                    sql +=' >';
                    break;
                case '>=':
                    sql +=' >=';
                    break;
                case '<':
                    sql +=' <';
                break;
                case '<=':
                    sql +=' <=';
                    break;
            }
            return sql;
        }
    }

    whereFields(fields){
        var sql='';
        if(typeof(fields)==='object'){
            for(var i=0; i<fields.length; i++){
                console.log(fields[i]);
                sql+=fields[i];
                if(i!=fields.length-1) sql+=',';
            }
        }
        console.log("sql fields: ",sql);
        return sql;
    }

    /**
     * 
     * @param {*obj : {field, op, value} } where 
     * @param {* LOGIC: AND | OR DEFAULT : AND} bool 
     * @returns where condition string
     */
    whereCriteria(where,bool=' AND '){
        console.log("CONDITION");
        var condition='';

        if(where.length<=0) return condition;

        if(indexOf(where)==='object'){
            var objKeys = where.keys();
            console.log("OBJ KEY: ",objKeys)
            for(var i=0; i<where.length; i++){
                condition+=''+where[i].field;
                condition+= this.checkOpWhereConditions(where[i].op)+' '+where[i].value;
                
                if(i!=objKeys.length-1) condition += bool;
            }
        }
        console.log("condition: ",condition);
        return condition;
        
    }

    async describe(tblname){
        console.log("describe DB")    
        if(tblname===false || tblname==='') reject(new Error("DB Error: tblname empty!"));
        if(typeof(tblname)==='string'){
           var descr = await this.doQuery("DESCRIBE "+tblname)
           return descr ; 
        }
    }

    queryString(tblname, type='SELECT', where=false, fields=false, order=false, limit=false, offset=false, orderBy=false){
        console.log("QUERY STRING: ",tblname, where)
        var sql='';

        switch(type){
            case 'SELECT':
                sql='SELECT ';
                if(fields!==false){
                    sql+=this.whereFields(fields);
                }
                else sql+=' * ';
                break;
            case 'DELETE':
                sql='DELETE ';
                break;
        }

        sql+=' FROM '+tblname;
        console.log("SQL: ",sql);

        if(where){
            if(typeof(where)==='string') sql+=' '+where;
            else sql=''+this.whereCriteria(where);
        }

        if(type==='SELECT'){
            if(limit!==false){
                if(offset!==false){ sql+=offset+','+limit; }
                else sql+=' LIMIT '+limit;
            }
            if(orderBy!==false){ sql+=' '+orderBy; }
        }
        console.log("SQL END: ",sql);
        return sql;
    }

    _deleteQueryString(tblname,where){
        var sql = this.queryString(tblname,'DELETE',where);
        console.log("DEL SQL: ",sql);
        return sql;
    }

    async _deleteQuery(params,tblname){
        var sql = this._deleteQueryString(tblname,params);
        return await this.doQuery(sql);
    }

    /**
     * 
     * @param {*} tblname 
     * @param {*} params 
     * @returns string sql
     */
    _insertQueryString(tblname,params){
        console.log("INSERT DB");
        console.log(params,tblname);
        console.log(typeof(params));

        if(typeof(params)==='object'){
            //console.log("dentro obj");
            var objKeys = Object.keys(params);
            //console.log("CHIAVI: ",objKeys);
            //console.log("LENGTH: ",objKeys.length);
            var q1 = ''; 
            var q2 = '';
            var fields = [];
            for(var i=0; i<objKeys.length; i++){
                //console.log("FOR obj",objKeys[i]);
                q1 += objKeys[i];
                q2 +='?';
                
                //console.log(q1, q2);
                //console.log(i,objKeys.length);
                if(i!==(objKeys.length-1)){
                    //console.log("diversi");
                    q1 += ',';
                    q2 += ',';
                }
                fields.push(params[objKeys[i]]);
            }
        }
        //console.log(q1);
        var sql="INSERT INTO "+tblname+"("+q1+") VALUES("+q2+")";
        console.log("INSERT SQL: ",sql);
        console.log("INSERT FIELDS: ",fields);
        var myArr = [sql,fields];
        return myArr;
    }

    /**
     * 
     * @param {*} params 
     * @param {*} tblname 
     * @returns 
     */
    async _insertQuery(params,tblname){
        
        var res = this.insertQueryString(tblname,params)

        var result = await this.doQuery(res[0],res[1]);  
        console.log("RESULT INSERT: ",result);
        return result;
    }

};

module.exports = Database ;