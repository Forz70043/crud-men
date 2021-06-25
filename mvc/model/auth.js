const Entity = require('../../entity');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Users = require('./users');
let users = new Users();
var Login = require('./login');
var login = new Login();

class Auth extends Entity {
    constructor(service=false){
        super();
        this.TBL='AUTH';
        if(service!=false){
            this.service = service;
            this.use(this.service);
        }
        this.scope=[];
        this.failureRedirect='/error';
        this.init();
        this.serialize();    
        //this.deserialize();
    }

    init(){
        return passport.initialize();
    }
    
    session(){
        return passport.session();
    }

    getFailureRedirectURL(){
        return this.failureRedirect;
    }

    getService(){
        return this.service;
    }

    setScope(){
        switch (this.getService()) {
            case 'github':
                this.scope = [ 'user:email' ];
                break;
            case 'google':
                this.scope=['profile', 'email'];
            break;
            case 'facebook':
                this.scope=['profile', 'email']
            break;
        }
    }

    getScope(){
        if(this.scope.length<=0){
            this.setScope();
            return this.scope;   
        }
        return this.scope;
    }

    authenticate(){
        return passport.authenticate(this.getService(),{ scope: this.getScope()});
    }

    authenticateCallBack(){
        return passport.authenticate(this.getService(),{ failureRedirect: this.getFailureRedirectURL()});
    }

    use(service){
        switch (service) {
            case 'github':
                this.gitHubAuth();
                break;
            case 'google':
                this.googleAuth();    
                break;
            case 'facebook':
                this.facebookAuth();
            break;
            case 'local':
                console.log("nothing for local now");
                break;
        }
    }

    serialize(){
        // Passport session setup.
        //   To support persistent login sessions, Passport needs to be able to
        //   serialize users into and deserialize users out of the session.  Typically,
        //   this will be as simple as storing the user ID when serializing, and finding
        //   the user by ID when deserializing.  However, since this example does not
        //   have a database of user records, the complete GitHub profile is serialized
        //   and deserialized.
        passport.serializeUser(async function(user, done) {
            console.log("XXXXUSERS ", user);
            done(null, user);
        });
    }

    deserialize(){
        passport.deserializeUser(function(obj, done) {
            console.log("DESERI",obj);
            done(null, obj);
        });
    }

    googleAuth(){
        var userProfile;
        passport.use(new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: /*process.env.GOOGLE_REDIRECT_URL*/"http://localhost:3000/auth/google/"
            },
            function(accessToken, refreshToken, profile, done) {
                //console.log(accessToken, refreshToken)
                console.log(profile)
                userProfile=profile;
                return done(null, userProfile);
            }
        ));
    }

    facebookAuth(){
        var userProfile;
        // Configure the Facebook strategy for use by Passport.
            //
            // OAuth 2.0-based strategies require a `verify` function which receives the
            // credential (`accessToken`) for accessing the Facebook API on the user's
            // behalf, along with the user's profile.  The function must invoke `cb`
            // with a user object, which will be set at `req.user` in route handlers after
            // authentication.
            passport.use(new FacebookStrategy({
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: 'http://localhost:3000/auth/facebook/' //'/auth/facebook'//'return'
            },
            function(accessToken, refreshToken, profile, cb) {
                //console.log(accessToken,refreshToken)
                console.log(profile)
                // In this example, the user's Facebook profile is supplied as the user
                // record.  In a production-quality application, the Facebook profile should
                // be associated with a user record in the application's database, which
                // allows for account linking and authentication with other identity
                // providers.
                return cb(null, profile);
            }));
    }


    gitHubAuth(){
        var userProfile;
        passport.use(new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_REDIRECT_url//"http://127.0.0.1:3000/auth/github/"
            },
            async function(accessToken, refreshToken, profile, done) {
                console.log("NELLA FUNZ ");
                //console.log(accessToken, refreshToken, profile);
                //console.log(profile);
                userProfile= profile;
                var myUser = await login.get('cod_id='+profile.id);
                console.log("MY USERS: ",myUser);
                if(myUser.length<=0){
                    console.log("<=0");
                    var newFields = login.gitHubInfo(userProfile);
                    var newUser = await users.add(newFields);
                    if(newUser){
                        console.log("NEW USERS ",newUser.inserId);
                        var newCod = await login.add({'cod_id':profile.id,'user_id':newUser.insertId});
                        userProfile = await users.get('id='+newUser.insertId);
                        console.log("NEW COD",newCod);
                    }
                    console.log(newUser);
                }
                else{
                    console.log(">0");
                    console.log("MY USERS: ",myUser[0]);
                    console.log(myUser[0].user_id);
                    userProfile = await users.get('id='+myUser[0].user_id);
                    console.log(userProfile);
                }
                //userProfile = profile;  
                return done(null, userProfile);
            }
        ));
    }
}

module.exports = Auth;