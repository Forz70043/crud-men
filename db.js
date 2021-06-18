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

    getTypes(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT id, name FROM TYPE')
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

    getGrocery(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT g.id, g.name, g.type_id as type_id, t.name as type, g.bought FROM GROCERY g LEFT JOIN TYPE t ON t.id=g.type_id')
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

    addGrocery(values){
        return new Promise((resolve, reject)=>{
            this.doQuery("INSERT INTO GROCERY(name,type_id,bought) VALUES (?,?,?)", values)
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

    addType(values){
        return new Promise((resolve, reject)=>{
            if(!values) reject(new Error('DB Insert Error: value not defined'));
            this.doQuery("INSERT INTO TYPE(name) VALUES (?)",values)
            .then((result)=>{
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
            this.doQuery('DELETE FROM GROCERY WHERE id IN (?)',values)
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

    deleteType(values){
        if(!values) reject(new Error('DB Delete Error: values not defined'));
        return new Promise((resolve,reject)=>{
            this.doQuery('DELETE FROM TYPE WHERE id IN (?)',values)
            .then((result)=>{
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                console.log(new Error(err));
                reject((err));
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

    addUser(values){
        console.log("ADD USER");
        console.log(values);
        return new Promise((resolve, reject)=>{
            this.doQuery('INSERT INTO USERS (name, surname, email, cod_id) VALUES (?,?,?,?)',values)
            .then((result)=>{
                resolve(result);
            })
            .catch((err)=>{
                console.log(new Error(err));
                reject(err);
            })
        })
    }

    getUser(values){
        return new Promise((resolve, reject)=>{
            console.log(values);
            this.doQuery("SELECT * FROM USERS WHERE cod_id IN (?)",values)
            .then((result)=>{
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            })
        })
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
                sql+=' WHERE '+where;
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

/*
exports.getTypes = () => {
    pool.getConnection((err, connection) => {
        if(err){
			console.log(err);
			throw err;
		}
        //console.log('connected as id ' + connection.threadId);
        connection.query('SELECT id, name FROM TYPE', (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from table are: \n', rows);
            return rows;
        });
    });
}
*/

/*
exports.getGrocery = () => {

    pool.getConnection((err, connection) => {
        if(err){
			console.log(err);
			throw err;
		}
        //console.log('connected as id ' + connection.threadId);
        connection.query('SELECT g.id, g.name, g.type_id as type_id, t.name as type, g.bought FROM GROCERY g LEFT JOIN TYPE t ON t.id=g.type_id', (err, rows, fields) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from table are: \n', rows);
            //console.log('The fields from table are: \n', fields);
            console.log(JSON.stringify(rows));
            return rows;
        });
    });
}
*/
module.exports = Database;