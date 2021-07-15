const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

/**
 * REQUIRE ROUTES
 */
let typesRouter = require('./routes/types');
let groceryRoute = require('./routes/grocery');
let authRoute = require('./routes/auth');
let loginRoute = require('./routes/login');
let usersRoute = require('./routes/users');

let Auth = require('./mvc/model/auth');
let auth = new Auth();

const { I18n } = require('i18n');
const i18n = new I18n({
	locales: ['en','it'],
	directory: path.join(__dirname, 'locales')
});

let Template = require('./templates');
let template = new Template();

const app = express();

app.set('appName','Shopping List');
//template engine
app.set('view engine', 'ejs');
app.set('port',process.env.PORT);
app.set('templateIndex','index');

const oneDay = 1000 * 60 * 60 * 24;
const oneMinute = 1000 * 60;

app.use(sessions({
    secret: "admin",
    saveUninitialized: true,
    cookie: { maxAge: oneMinute },
    resave: false 
}));

//req from body => body-parser included into express core from v>4.16
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(i18n.init);
app.use(auth.init());
app.use(auth.session());

// cookie parser middleware
app.use(cookieParser());

/**
 * 	servers static files js,css
 */
app.use('/public',express.static(path.join(__dirname, 'public/css')));
app.use('/public',express.static(path.join(__dirname, 'public/js')));
app.use('/public',express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));


/**
 * ROUTE
 */
app.use('/types', typesRouter);
app.use('/groceries', groceryRoute);
app.use('/auth',authRoute);
app.use('/login',loginRoute);
app.use('/users',usersRoute);

auth.serialize();
auth.deserialize();

app.get('/home', (req,res)=>{
	console.log("req.sess: ",req.session);

	if(req.session.loggedIn) template.myRender(res,'dashboard');
	else res.redirect('/login');
})

app.get('/register', (req,res)=>{ template.myRender(res,'register') });
app.get('/login', (req, res)=>{ template.myRender(res, 'main')});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/register', (req, res)=>{
	console.log("login");
	console.log("login",req.body);

})

app.post('/login', async(req, res)=>{
	console.log("login");
	let result = await auth.loginAuth({'email':req.body.email,'password':req.body.password})
	if(result){
		req.session.user = result[0];
		req.session.loggedIn = true;
		
		res.redirect('/home');
	}
	else res.redirect('/login');
})



app.get('/success', (req, res) =>{
	console.log("SUSSES: ",req.user)
	res.send(req.user);
});
app.get('/error', (req, res) => res.send("error logging in"));


/*
 * Req for request & res for response
 * get data
 */
app.get('/',function(req,res){
	//inserire logica se già auth
	//res.render(app.get('templateIndex'),{login: 1, filename:false, links: false/*['home']*/});
	template.myRender(res,'main');
});

app.listen(process.env.PORT,function(){
	console.log(`app listen on: http://localhost:${process.env.PORT}`);
});

module.exports = app;
