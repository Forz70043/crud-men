const Entity = require('../../entity');
const bcrypt = require('bcrypt');

class Users extends Entity {
    constructor(){
        super();
        this.TBL='USERS';
        this.TBLJOIN = 'u LEFT JOIN ROLE r ON r.id=u.role_id';
        
        this.setFields({
            'id':{
                as: 'u.id',
                required:true },
            'name':{
                as: 'u.name',
                required:true },
            'surname':{ 
                as:'u.surname',
                required:true },
            'email': {
                as: 'u.email',
                required: false },
            'password': {
                as: 'u.password',
                required: false },
            'phone': {
                as: 'u.phone',
                required: false },
            'role_id': {
                    as: 'u.role_id',
                    required: false },
            'role':{
                as:'r.name',
                required:false
            },
            'address': {
                as: 'u.address',
                required: false },
            'yearOfBirth': {
                as: 'u.yearOfBirth',
                required: false },
            'job_id': {
                as: 'u.job_id',
                required: false },
            }
        );
        this.saltRounds = 10;
    }
    /**
     * 
     * @returns saltRounds password
     */
    getSaltRounds(){
        return this.saltRounds;
    }

    sanitizePass(value){
        let hashPass;
        if(value.length>0){

            let salt = bcrypt.genSaltSync(this.getSaltRounds());
            let hash = bcrypt.hashSync(value, salt);

            hashPass = hash;
            console.log(hashPass);
            return hashPass;
        }
    }


    checkParams(params){
        console.log("checkParams");    
        var paramsKeys = Object.keys(params);  
        console.log(paramsKeys.length);      
        
        var fields = this.getFieldsArray();
        console.log(fields);    
        let fieldsKeys = Object.keys(fields);
        console.log(fieldsKeys.length);    
        
        var realParams = {};
        
        if(paramsKeys.length < fieldsKeys.length){
            console.log("parametri inferiori al n. dei fields");
            for(let i = 0; i < fieldsKeys.length; i++){
                
                if(Object.keys(params).includes(fieldsKeys[i])){
                    
                    if(fieldsKeys[i]==='password') realParams[fieldsKeys[i]]=this.sanitizePass(params[fieldsKeys[i]]);
                    else realParams[fieldsKeys[i]]=params[fieldsKeys[i]];
                    
                }
                else{
                    console.log("FFFFV",fieldsKeys[i]);
                    if(fieldsKeys[i]==='id') continue;
                    if(fieldsKeys[i]==='name') realParams[fieldsKeys[i]]='Mario'
                    if(fieldsKeys[i]==='surname') realParams[fieldsKeys[i]]='Automatico';
                    if(fieldsKeys[i]==='phone') realParams[fieldsKeys[i]]='01234567898';
                    if(fieldsKeys[i]==='role_id') realParams[fieldsKeys[i]]='4';
                    if(fieldsKeys[i]==='address') realParams[fieldsKeys[i]]='Via le mani dal naso';
                    if(fieldsKeys[i]==='yearOfBirth') realParams[fieldsKeys[i]]='2021-01-21';
                    if(fieldsKeys[i]==='job_id') realParams[fieldsKeys[i]]='2';
                }
            }
            if(Object.keys(fields).includes(paramsKeys[i])){

            }
        }
        else{

            for(var i=0; i<paramsKeys.length; i++){

                if(Object.keys(fields).includes(paramsKeys[i])){
                    console.log("V",paramsKeys[i]);
                    if(paramsKeys[i]==='password'){
                        realParams[paramsKeys[i]]=this.sanitizePass(params[paramsKeys[i]]);
                    }
                    else if(paramsKeys[i]==='gender'){
                        realParams[paramsKeys[i]] = (params[paramsKeys[i]]==='male') ? '0' : '1';
                    }
                    else{
                        realParams[paramsKeys[i]]=params[paramsKeys[i]];
                    }
                }
                else{
                    console.log("F",paramsKeys[i]);
                    /* if(objKeys[i]==='docCheck'){
    
                        console.log(objKeys[i],params[objKeys[i]]);
                        if(params[objKeys[i]]==='1')  realParams['role_id']='2';
                        else realParams['role_id']='3';
                    } */
                }
            }
        }
        
        console.log("RRR: ",realParams);
        return realParams;
    }



    /**
     * 
     * @returns Users result query
     */
    async getAll(){
        var result = await this.find(false,this.getFields());
        //console.log("GET ALL :",result);
        return result;
    } 

    /**
     * Add user
     * @param {object} params {param1:value1, param2: value2} 
     * @returns result of query
     */
    async add(params){
       /*  console.log("ADD USER: ",params); */
       console.log("ADD USER: ",params);
        var objKeys = Object.keys(params);
		console.log("ADD USER objKeys: ",objKeys);
        if(objKeys.length>0){
            console.log("params >0");
            var newParams = this.checkParams(params);
            console.log("NPARAMS: ",newParams);
			
			var result = await this.insertQuery(newParams);
			console.log(" ADD: ",result);
			return result;
		}
		else {
            console.log("params length<0");
            return false;
        }    
    }

    async getFromCode(code){
        //console.log(code);
        var result = await this.find();
        //console.log("GET ALL :",result);
        return result;
    }
    /**
     * 
     * @param {*} where string
     * @returns result of query
     */
    async get(where=false){
        /* console.log("GET WHERE: ",where); */
        var result = await this.find(where);
        //console.log("GET :",result);
        return result;
    }

    /**
     * Call find with this.getFields()
     * @param {*} where string
     * @returns result wquery
     */
    async getWhere(where=false){
        /* console.log("get where: "); */
        let result = await this.find(where,this.getFields());
        
        return result;
    }

    async updateUser(params, where){
        console.log("UPD: ",params);
        console.log(where);
        var condition='id='+where;

        var result = await this.update(params,condition);
        if(result){
            //console.log(result);
            return result;
        }
        else return false;
    }

}


module.exports = Users;