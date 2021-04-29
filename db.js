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

    /*
        Connessione Implicita
    */

    doQuery(sql, args){
        return new Promise((resolve, reject)=>{
            this.connection.query(sql, args, (err, rows, fields)=>{
                console.log(sql);
                if(err){
                    reject(new Error(err));
                }
                //resolve({rows,fields});
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

    getRoles(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT id, name FROM ROLE')
            .then((obj)=>{
                //console.log(obj);
                //console.log(JSON.parse(JSON.stringify(obj)));

                resolve(JSON.parse(JSON.stringify(obj)));
            })
            .catch((err)=>{
                console.log(err);
                reject(new Error(err));
            })
        })
    }

    getUsers(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT u.id, u.name, u.surname, u.email, u.role_id as role_id, r.name as role FROM USERS u LEFT JOIN ROLE r ON r.id=u.role_id')
                .then((obj)=>{
                    //console.log(obj);
                    //console.log(JSON.parse(JSON.stringify(obj)));
                    resolve(JSON.parse(JSON.stringify(obj)));
                    //return JSON.parse(JSON.stringify(obj));
                })
                .catch((err)=>{
                    console.log(err);
                    reject(new Error(err));
                })
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
     * @param {*} bool 
     * @returns 
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

    describe(tblname){
        console.log("describe DB")
            
        if(tblname===false || tblname==='') reject(new Error("DB Error: tblname empty!"));
        
        if(typeof(tblname)==='string'){

            this.doQuery("DESCRIBE "+tblname)
            .then((result)=>{
                //console.log(result);
                return result ;
            })
            .catch((err)=>{
                console.log(err);
                return new Error(err);
            })
        }
    }

    queryString(tblname, type='SELECT', where=false, order=false, limit=false, offset=false, fields=false, orderBy=false){
        console.log("QUERY STRING: ",tblname, where)
        var sql='';

        switch(type){
            case 'SELECT':
                sql='SELECT ';
                if(fields!==false){
                    sql+=this.whereFields(fields);
                }
                else sql+=' *';
                 
                break;

            case 'DELETE':
                sql='DELETE ';
                break;
        }

        sql+=' FROM '+tblname;
        console.log("SQL: ",sql);

        if(where){
            if(typeof(where)==='string'){
                sql+=' '+where;
            }
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

    checkInsertParamsFields(params,fields){

    }

    insertQueryString(tblname,params,fields){
        
        if(typeof(tblname)==='string' && typeof(params)==='object'){
            if(tblname.length>0){
                var q1,q2='';
                for(var i=0; i<params.length; i++){
                    console.log(params[i]);
                    if(fields.includes(params[i].field)){
                        q1+=params.field;
                        if(i!=params.length-1) q1+=',';
                    }
                    
                    q2+=params[i].value;
                    if(i!=params.length-1) q2+=',';
                }
                console.log("Q1: ",q1,"Q2: ",q2);
                var sql="INSERT INTO "+tblname+"("+q1+") VALUES("+q2+")";
                console.log("SQL insert: ",sql)
                return sql;
            }
        }
    }
    /*
        params = { fields: valore}
    */
    async insertQueryString_(params,tblname){
        
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

        var result = await this.doQuery(sql,fields);  
        console.log("RESULT INSERT: ",result);
        return result;
    }

};

module.exports = Database ;