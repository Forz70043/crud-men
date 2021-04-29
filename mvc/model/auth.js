
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

class Auth extends Entity {
    constructor(service){
        super();
        this.service = service;
    }


    use(service){
        var userProfile;
        switch (service) {
            case 'github':
                passport.use(new GitHubStrategy(
                    {
                        clientID: process.env.GITHUB_CLIENT_ID,
                        clientSecret: process.env.GITHUB_CLIENT_SECRET,
                        callbackURL: process.env.GITHUB_REDIRECT_url//"http://127.0.0.1:3000/auth/github/"
                    },
                    function(accessToken, refreshToken, profile, done) {
                        console.log(accessToken,refreshToken,profile);
                        //User.findOrCreate({ githubId: profile.id }, function (err, user) {
                        userProfile = profile;  
                        return done(null, userProfile);
                    }
                ));
                break;
            case 'google':
                passport.use(new GoogleStrategy(
                    {
                        clientID: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        callbackURL: process.env.GOOGLE_REDIRECT_URL//"http://localhost:3000/auth/google/"
                    },
                      function(accessToken, refreshToken, profile, done) {
                        userProfile=profile;
                          return done(null, userProfile);
                      }
                ));
                break;
            case 'facebook':
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
                    // In this example, the user's Facebook profile is supplied as the user
                    // record.  In a production-quality application, the Facebook profile should
                    // be associated with a user record in the application's database, which
                    // allows for account linking and authentication with other identity
                    // providers.
                    return cb(null, profile);
                }));
                break;
            case 'local':
                console.log("nothing for local now");
                break;
        }
    }


    gitHubAuth(){
        
    }

}


module.exports = Auth;