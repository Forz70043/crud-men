const env = require('dotenv').config();
const mysql = require('mysql');
//const MongoClient = require('mongodb').MongoClient;

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

const pool = mysql.createPool({
    connectionLimit: 100,
	/*
        connectTimeout  : 60 * 60 * 1000,
        acquireTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
    */
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

exports.getGrocery = () => {
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

    /*connection.connect(function(err){
        if(err) throw err;
        console.log("Connected");

        console.log(connection);
        connection.query('SELECT * FROM GROCERY', (err, results, fields)=>{
            if(err){
                console.log("error: ");
                console.log(err);
                throw err;
            }
            console.log(results);

            console.log("fields"); console.log(fields);
            return results;
        });
    });
    */

    pool.getConnection((err, connection) => {
        if(err){
			console.log(err);
			throw err;
		}
        //console.log('connected as id ' + connection.threadId);
        connection.query('SELECT g.id, g.name, g.type_id as type_id, t.name as type, g.bought FROM GROCERY g LEFT JOIN TYPE t ON t.id=g.type_id', (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from table are: \n', rows);
            return rows;
        });
    });
}

	//mongoConnection
/*
	MongoClient.connect('mongodb://127.0.0.1:27017',{useUnifiedTopology: true},(err,client)=>{
		//start mongo server
		if(err) return console.log(err);
		db = client.db('crud-men');     //<= db 

		app.listen(process.env.PORT|| 3000, ()=>{
			console.log('listening on 3000');
		});
	});
*/
