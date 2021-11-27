let express = require('express');
let router = express.Router();
let Template = require('../templates');
let template = new Template();

let Roles = require('../mvc/model/role');
let roles = new Roles();

let Users = require('../mvc/model/users');
let users = new Users();


router.get('/', async (req,res)=>{
	console.log("req.sess: ",req.session);
	console.log("req.sess user: ",req.session.user);
    let rolesLabel=dataRoles=[];
	if(req.session.loggedIn && req.session.user){
        let ruoli = await roles.get();
        console.log("RRR:",ruoli);

        let countUserRole = await roles.getRoleCountUsers();
        console.log("CCCCCC",countUserRole);
        
        for(let i=0; i<ruoli.length; i++){
            console.log("ruoli: ", ruoli[i]);
            rolesLabel[i]=ruoli[i]['name'];
            console.log("XXXX", countUserRole[i]);
            if(countUserRole[i] !== undefined){
                
                if(i <= countUserRole.length){
                    if(ruoli[i]['name']==countUserRole[i]['name']) dataRoles[i]=countUserRole[i]['n_users']
                    else dataRoles[i]=0;
                }

            }
        }
        
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
        dashboards = {
            'charts': chart
            
        }
        
        template.myRender(res,'dashboard',false,false,req.session.user,dashboards);
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