const Type = require('../models/Type');

exports.getTypes = function(req, res){
    return new Promise((resolve, reject)=>{
        Type.getTypes()
        .then((result)=>{
            resolve(result);
        })    
        .catch((err)=>{
            reject(err);
        })
    })
    /*Type.getTypes(function(err, employee) {
        console.log('controller')  
        if (err)  res.send(err);  
        console.log('res', employee);  
        res.send(employee);
    });
    */
};


/* class Type {
    constructor(){

    }

    getTypes(){
        return new Promise((resolve, reject)=>{
            type.getTypes()
            .then((result)=>{
                resolve(result);
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }


};
module.exports = Type; */