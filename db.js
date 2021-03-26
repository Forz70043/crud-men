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

};
/*
const pool = mysql.createPool({
    connectionLimit: 100,
	debug: true,
    host: process.env.DB_HOST,//'127.0.0.1',
    user: process.env.DB_USER,//'app',
    password: process.env.DB_PASS,//'admin',
    database: process.env.DB_NAME,//'TEST',
	port: 3306
});
*/
/*
    connection.connect((err)=>{
        if(err) throw err;
        console.log("Connected");
    });
*/
/*
    pool.getConnection((err, connection)=>{
        return new Promise((resolve, reject) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    reject('Database connection was closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    reject('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    reject('Database connection was refused.');
                }
            }
            if (connection) connection.release()
            resolve();
        });
    });
*/
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