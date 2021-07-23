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
        if(userId){
            let user = await users.get('u.id='+userId);
            if(user){
                if(user.role=="admin") return true
                else return false
            }
        }
        return false
    }
    /**
     * 
     * @param {*} params obj {'nome1':valore1, etc..}
     */
    setObj(params){

        console.log("P: ",params);
        console.log("OBJ: ",this.obj)
        let keyParams = Object.keys(params)
        console.log("KP:",keyParams);
        for(let i = 0; i<keyParams.length; i++){
            console.log(keyParams[i]);
            console.log(params[keyParams[i]]);
            if(keyParams[i]==='rows'){
                console.log("CHE FACCIO CON LE ROWS ??");
            }
            this.obj[keyParams[i]] = params[keyParams[i]];
        }
        console.log("OBJ MOD:",this.obj);
        //return this.obj;
    }

    getObj(){
        console.log(this.obj);
        return this.obj;
    }

    /**
     * 
     * @param {*} login boolean
     * @param {*} filename string or false (filename of view)
     * @param {*} links string or false (breakcrumbs)
     * @param {*} types false or array of obj
     * @param {*} rows false or array of obj
     * @param {*} obj 
     * @param {*} template 
     * @param {*} container 
     * @param {*} sidebar 
     * @param {*} navbar 
     * @param {*} title string of the page
     * @param {*} countries 
     * @param {*} job 
     * @param {*} message 
     * @param {*} user 
     * @returns 
     */
    async params(
        login = false,
        filename = false,
        links = false,
        types = false,
        rows =false,
        obj = false,
        template = false, 
        container = false, 
        sidebar = false, 
        navbar = false, 
        title = false, 
        countries = false, 
        job = false, 
        message = false, 
        user = false,
        profile = false,
        ) {
        if (!title) title = this.getTitle();
        if (!navbar) navbar = this.getNavbar();
        if (!login) login=false;
        
        console.log(profile);
        if(profile){
            let roleAdmin = await users.isAdmin(profile.role_id)
            if(roleAdmin){ sidebar = this.getFullSidebar(); }

        }
        if (!sidebar) sidebar = this.getSidebar();

        var params = {
            login: login,
            filename: filename,
            links: links,
            types: types,
            rows: rows,
            title: title,
            container: container,
            template: template,
            sidebar: sidebar,
            navbar: navbar,
            countries: countries,
            job: job,
            message: message,
            user: user,
            profile: profile,
            others: {}
        }
        //console.log(params);
        /* if (arguments.length > 5) {
            console.log("MAGGIOREEEEE DI 5");
            var i = 5
            var k = 0
            while (i == arguments.length - 1) {
                console.log("ZZZZZ",arguments[i]);
                params['others'][k] = arguments[i];
                i++; k++
            }
            //console.log("PARAMS: ", params)
        } */
        console.log("PARAMS: ", params)
        return params;
    }

    async getParams(filename=false, links=false, types=false, rows=false, users=false, profile=false){
        return await this.params(false,filename,links,types,rows,false,false,false,false,false,false,false,false,users, profile);
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
                'icon': 'fas fa-home'
            },
            {
                'name': 'Types',
                'link': '/types',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-user-injured'
            },
            {
                'name': 'Users',
                'link': '/users',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-prescription-bottle-alt'
            },
            {
                'name': 'Roles',
                'link': '/roles',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-prescription-bottle-alt'
            },
            {
                'name': 'Logout',
                'link': '/logout',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-calendar-check'
            }
        ]
        return sidebar;
    }

    /**
     * 
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
                'icon': 'fas fa-user-injured'
            },
            {
                'name': 'Users',
                'link': '/users',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-users'
            },
            {
                'name': 'Logout',
                'link': '/logout',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-sign-out-alt'
            },
            /*{
                'name': 'Request Analysis',
                'link': '/req-analysis',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-file-invoice'
            },
            {
                'name': 'Request Vaccines',
                'link': '/vaccines',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-syringe'
            },
            {
                'name': 'Profile',
                'link': '/profile',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-id-badge'
            }, */
        ]
        return sidebar;
    }

    /**
     * 
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
     * 
     * @param {*} res response object
     * @param {*} filename string file name view
     * @param {*} links 
     * @param {*} rows 
     * @param {*} profile 
     * @returns res.render();
     */
    async myRender(res, filename=false, links=false, rows=false, profile=false) {
        this.setObj({'profile':profile, 'rows':rows, 'links':links, 'filename':filename});
        let obj = this.getObj();
        console.log("XXX OBJ",obj)
        return res.render(this.getTemplateIndex(), obj);
    }

};
module.exports = Template;
