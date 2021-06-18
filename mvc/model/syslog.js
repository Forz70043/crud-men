const Entity = require('../../entity');

class Syslog extends Entity {
    
    constructor(){
        super();
        this.TBL = 'SYSLOG';
        this.fields = ['id','remote_id','forward_id','email','action','date']
    }



    add(params){
        if(params===false && params.length<4) return new Error("ADD "+this.getTblname()+": no params found");

        return new Promise((resolve, reject)=>{
            databases.doQuery("INSERT INTO "+this.TBL+"(remote_id, forward_ip, email, action) VALUES(?,?,?,?)",params)
            .then((result)=>{
                console.log(result);
                resolve(result);
            })
            .catch((err)=>{
                console.log(err);
                reject(err)
            })
        })
    };

    get(){
        return new Promise((resolve, reject)=>{
            this.doQuery()
        })
    }    

}

module.exports = Syslog;