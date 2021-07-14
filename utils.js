
class Utils {
    constructor(){}

    checkEmail(email){
        
        var emailToChek = email.toLowerCase();
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(emailToChek)){
            console.log("TEST EMAIL: ",re.test(emailToChek));
            return true;
        }
        else return false;
    }

    encodeBase64(string){

        if(typeof(string)==='string'){
            const buff = Buffer.from(string, 'utf-8');
            const base64 = buff.toString('base64');
        
            return base64;
        }
    }

    decodeBase64(base64){

        const buff = Buffer.from(base64, 'base64');
        // decode buffer as UTF-8
        const str = buff.toString('utf-8');

        return str;
    }

}

module.exports = Utils;