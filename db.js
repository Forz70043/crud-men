const env = require('dotenv').config();
const mysql = require('mysql');
//const MongoClient = require('mongodb').MongoClient;

/*	db.collection('quotes').find().toArray(function(err,results){
		//console.log(results);
		if(err) return console.log(err);
		res.render('index.ejs',{quotes: results });
	});
*/

/*
var connection = mysql.createConnection({
	host:     'localhost',//process.env.DB_HOST,//'localhost',
	user:     process.env.DB_USER,//'forz',
	password: process.env.DB_PASS,//'admin',
	database: process.env.DB_NAME,//'TEST'
});
*/
/*
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'app',
    password: 'admin',
    database: 'TEST'
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
    doQuery(query, args){
        return new Promise((resolve, reject)=>{
            this.connection.query(query, args, (err, rows, fields)=>{
                if(err){
                    return reject(new Error(err));
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
        this.doQuery('SELECT id, name FROM TYPE')
        .then((obj)=>{
            console.log(obj);
            console.log(JSON.parse(JSON.stringify(obj)));

            return JSON.parse(JSON.stringify(obj));
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    getGrocery(){
        return new Promise((resolve, reject)=>{
            this.doQuery('SELECT g.id, g.name, g.type_id as type_id, t.name as type, g.bought FROM GROCERY g LEFT JOIN TYPE t ON t.id=g.type_id')
                .then((obj)=>{
                    console.log(obj);
                    console.log(JSON.parse(JSON.stringify(obj)));
                    resolve(obj);
                })
                .catch((err)=>{
                    console.log(err);
                    reject(new Error(err));
                })
        });
    }

};

const pool = mysql.createPool({
    connectionLimit: 100,
	debug: true,
    host: process.env.DB_HOST,//'127.0.0.1',
    user: process.env.DB_USER,//'app',
    password: process.env.DB_PASS,//'admin',
    database: process.env.DB_NAME,//'TEST',
	port: 3306
});

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