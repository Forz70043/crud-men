let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Roles = require('../mvc/model/role');
let roles = new Roles();

let Users = require('../mvc/model/users');
let users = new Users();

let Dashboard = require('../mvc/model/dashboard');
let dashboards = new Dashboard();

let Groceries = require('../mvc/model/groceries');
let groceries = new Groceries();


router.get('/', async (req,res)=>{
	console.log("/GET HOME ROUTE SESSION ", req.session);
	//console.log("req.sess user: ",req.session.user);
    //let rolesLabel = [];
    //let dataRoles = [];
	if(req.session.loggedIn && req.session.user){
        let isAdmin = await template.isAdmin(req.session.user);
        //console.log("isAdmin: ", isAdmin);
        let grocerie;
        if(isAdmin){
            grocerie = await groceries.getAll();
            console.log("is Admin GR ",grocerie);
        }
        else{
            grocerie = await groceries.getWhere(' u.id='+req.session.user.id);
            console.log("mygroceries: "+grocerie);
        }

        template.myRender(res,'groceries2',['groceries'],{'groceries': grocerie},req.session.user);
        
        /*
        //DASHBOARD VIEWS
        let ruoli = await roles.get();
        console.log("Ruoli: ",ruoli);
        let countUserRole = await roles.getRoleCountUsers();
        console.log("countUserRole ",countUserRole);
        for(let i=0; i<ruoli.length; i++){
            console.log("ruoli [i]: ", ruoli[i]);
            rolesLabel[i]=ruoli[i]['name'];
            //console.log("XXXX", countUserRole[i]);
            if(countUserRole[i] !== undefined){
                if(i <= countUserRole.length){
                    if(ruoli[i]['name']==countUserRole[i]['name']) dataRoles[i]=countUserRole[i]['n_users']
                    else dataRoles[i]=0;
                }
            }
        }
        //roles
        let chart = {
            'type': 'doughnut',
            'data':{
                'labels': rolesLabel,
                'datasets':{
                    label: '# of Votes',
                    data: dataRoles,
                }
            }
        }
        dashboard = {
            'charts': chart
            
        }
        console.log('dashboard object: ', dashboard);
        template.myRender(res,'dashboard',false,false,req.session.user,dashboard);
        */

    }
	else res.redirect('/login');
})




router.get('/profile', async(req, res)=>{
	console.log('profile');
    console.log("RQ sess", req.session);


    if(req.session.loggedIn && req.session.user){
        let ruoli = await roles.get();
        template.myRender(res,'profile',['home'],{'roles':ruoli},req.session.user);
    }
    else res.redirect('/login');
});

router.post('/profile', async(req, res)=>{
    console.log('profile');
    console.log("RQ sess", req.session);
    console.log("RQ params", req.body);
    let result;
    if(req.body.update){
        let params = {'name':req.body.name,'surname':req.body.surname,'email':req.body.email, 'phone':req.body.phone, 'address':req.body.address, 'yearOfBirth':req.body.yearOfBirth}
        result = await users.updateUser(params, req.body.id);
        console.log("result", result);
        if(result){
            if(req.session.user.id==req.body.id){
                //
                console.log("AGGGIORNARE DATI UTENTE IN SESSIONE ????");
            }
            //template.myRender(res,'profile',false,false,false,false,false,req.session.user);
            res.redirect('/home/profile')
        } 
        else console.log("result false");
    }
    else if(req.body.delete){
        //
        console.log("DELETE USER PI§ AVANTI");
    }
    
    if(result) res.redirect('/home/profile')
    /* template.myRender(res,'profile',false,false,false,false,false,req.session.user); */
    else return false;
})


router.get('/settings', async(req, res)=>{
	console.log('profile');
    console.log("RQ sess", req.session);


    if(req.session.loggedIn && req.session.user) template.myRender(res,'settings',false,false,req.session.user);
    else res.redirect('/login');
});
  



module.exports = router;