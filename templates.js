let User = require('./mvc/model/users');
let users = new User();

class Template {
    constructor() {
        this.sidebar
        this.template = this.getTemplateIndex()
        this.navbar
        this.title = 'Shopping List'
        this.obj = {
            'profile': false,
            'rows': {
                'types': {},
                'users': {},
                'groceries': {},
                'countries': {},
            },
            
            'login': false,

            'filename': false,
            'links': false,
            
            'sidebar': this.getSidebar(),
            'navbar': this.getNavbar(),
            'title': this.getTitle(),
            
            'templateIndex': this.getTemplateIndex(),
            
            'message': false,
            'container': false,
            'dashboards':{
                'charts':{
                    'type':'',
                    'data':{
                        'labels':[],
                        'datasets':[{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            }
        }
    }
    
    /**
     * 
     * @returns title string
     */
    getTitle() {
        return this.title;
    }

    /**
     * 
     * @returns template index
     */
    //template = getTemplateIndex();

    getTemplateIndex() {
        return 'index';
    }

    /**
     * 
     * @param {*} user id
     */
    async isAdmin(userId){
        if(typeof(userId) === 'object'){
            if(userId.role == 'admin') return true;
            else return false;
        }
        else if(parseInt(userId) >0){
            let user = await users.get('u.id='+userId);
            if(user){
                if(user.role=="admin") return true
                else return false
            }
        }
        return false
    }

    checkAdmin(role_id){
        if(role_id==1) return true
        else return false;
    }

    /**
     * 
     * @param {*} params obj {'nome1':valore1, etc..}
     */
    setObj(params){
        //console.log("P: ",params);
        //console.log("OBJ: ",this.obj)
        let keyParams = Object.keys(params)
        console.log("Templates setObj() KeyParams: ",keyParams);
        for(let i = 0; i<keyParams.length; i++){
            this.obj[keyParams[i]] = params[keyParams[i]];

            if(keyParams[i]==='rows'){
                //console.log("QUI OPERARE ROWS .....");
            }
            if(keyParams[i]==='login'){
                if(params['login']){}
            }
            if(keyParams[i]==='profile'){
                if(this.obj[keyParams[i]]['role'] == 'admin'){
                    console.log("ADMIN _________________________________________________________")
                    this.obj['sidebar'] = this.getFullSidebar();
                }
                //(this.obj['profile']['id']) ? this.obj['login'] = true : this.obj['login'] = false ;
            }
        }
        (this.obj['profile'] == false || this.obj['profile'] == null || this.obj['profile'] == undefined) ?  this.obj['sidebar'] = this.getLogOutSidebar() : this.obj['sidebar'] = this.getLoggedInSidebar() ;
        /*
        if(this.obj['profile']){
            if(this.obj['profile']['role'] == 'admin') this.obj['sidebar']=this.getFullSidebar();
            else this.obj['sidebar'] = this.getSidebar();
            
            this.obj['login'] = true;
        }
        else{
            this.obj['sidebar'] = this.getLogOutSidebar();
            this.obj['login']= false ;
        }
        */
        //console.log("OBJ MOD:",this.obj);
    }

    getObj(){
        return this.obj;
    }
    
    getLogOutSidebar(){

        let sidebar = [
            {
                'name': 'Login',
                'link': '/login',
                'active': false,
                'onClick': "",
                'icon': ' fa-sign-in-alt'
            },
            {
                'name': 'Register',
                'link': '/register',
                'active': false,
                'onClick': "",
                'icon': ' fa-sign-out-alt'
            },
        ]

        return sidebar;
    }

    getLoggedInSidebar(){
        let sidebar = [
            {
                'name': 'Home',
                'link': '/home',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-home'
            },
            {
                'name': 'Grocery',
                'link': '/groceries',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-shopping-basket'
            },
            {
                'name': 'Types',
                'link': '/types',
                'active': false,
                'onClick': "",
                'icon': 'fas bread-slice'
            },
            {
                'name': 'Logout',
                'link': '/logout',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-sign-out-alt'
            }
        ]
        return sidebar;

    }

    getFullSidebar(){
        let sidebar = [
            {
                'name': 'Home',
                'link': '/',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-home'
            },
            {
                'name': 'Grocery',
                'link': '/groceries',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-shopping-basket'
            },
            {
                'name': 'Types',
                'link': '/types',
                'active': false,
                'onClick': "",
                'icon': 'fas bread-slice'
            },
            {
                'name': 'Users',
                'link': '/users',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-users'
            },
            {
                'name': 'Roles',
                'link': '/roles',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-user-tag'
            },
            {
                'name': 'Logout',
                'link': '/logout',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-sign-out-alt'
            }
        ]
        return sidebar;
    }

    /**
     * @returns sidebar array {name,link,active, onclick, icon}
     */
    getSidebar() {
        let sidebar = [
            {
                'name': 'Home',
                'link': '/home',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-home'
            },
            {
                'name': 'Groceries',
                'link': '/groceries',
                'active': true,
                'onClick': "",
                'icon': 'fas fa-shopping-basket'
            },
            {
                'name': 'Types',
                'link': '/types',
                'active': false,
                'onClick': "",
                'icon': 'fas bread-slice'
            },
            {
                'name': 'Logout',
                'link': '/logout',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-sign-out-alt'
            }
        ]
        return sidebar;
    }

    /**
     * @returns Object Navbar {Name, link }
     */
    getNavbar() {
        var navbar = [
            {
                'name': 'Sign in',
                'link': '/login',
            },
            {
                'name': 'Register',
                'link': '/register'
            },
        ]
        return navbar;
    }

    /**
     * @param {*} res response object
     * @param {*} filename string file name view
     * @param {*} links 
     * @param {*} rows 
     * @param {*} profile 
     * @returns res.render();
     */
    async myRender(res, filename=false, links=false, rows=false, profile=false,dashboards=false) {
        this.setObj({'profile':profile, 'rows':rows, 'links':links, 'filename':filename,'dashboards':dashboards});
        let obj = this.getObj();
        //console.log("XXX OBJ",obj)
        return res.render(this.getTemplateIndex(), obj);
    }

};
module.exports = Template;
