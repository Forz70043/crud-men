let Entity = require('../../entity');
let User = require('./users');
let users = new User();

class Login extends Entity {
    constructor(){
        super();
        this.TBL='AUTH';
        this.fields = {'cod_id':{},'user_id':{}};
    }

    async get(where=false){
        var result = await this.find(where,false);
        console.log("GET ALL :",result);
        return result;
    }

    gitHubInfo(params){
        var userFields;
        console.log("INFO ",params);
        
        userFields={
            'name': params.displayName,
            'surname': params.username,
            'email': (params.email!=null) ? params.email : '',
            'password': (params.password!=null) ? params.password : '',
            'piva': '0000000000',
            'phone': '0000000000',
            'address': '',
            'role_id': 1,
            'photo': params.photos[0].value,
            'yearOfBirth': '1900-01-01'
        }
        //console.log(userFields);
        return userFields;
    }

    async add(params){
        //console.log(" ADD ",params);
		//console.log(Object.keys(params).length);

		var objKeys = Object.keys(params);
		if(objKeys.length>0){
			//console.log("params >0");
			var result = await this.insertQuery(params);
			//console.log(" ADD: ",result);
			return result;
		}
		else console.log("params <0");
    }

}
module.exports = Login;