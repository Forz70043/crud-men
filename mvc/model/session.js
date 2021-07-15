let Entity = require('../../entity');


class Session extends Entity {
    constructor(params=false){
        super();
        this.loggedIn = params.loggedIn ? params.loggedIn:false;
        this.user = params.user ? params.user:false;
    }

    unsetSession(){
        this.loggedIn = false;
        this.user = false;
    }
    getLoggedIn(){
        return this.loggedIn;
    }
    getUser(){
        return this.user;
    }

};

module.exports = Session;