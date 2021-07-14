let Entity = require('./entity');
let entity = new Entity();

class Template {
    constructor() {
        this.sidebar
        this.template = this.getTemplateIndex()
        this.params
        this.navbar
        this.title = 'Shopping List'
    }

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
     * @param {* string of template file name} template 
     * @param {* string name of cointainer} container
     * @param {* array of sidebar object} sidebar 
     * @param {* array of navbar object} navbar
     * @param {* string of app name} title 
     * @returns object
     */
    params(
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
        user = false
        ) {
        if (!title) title = this.getTitle();
        if (!navbar) navbar = this.getNavbar();
        if (!sidebar) sidebar = this.getSidebar();
        if (!login) login=false;

        //console.log("ARGS", arguments);
        //console.log("ARGS N°", arguments.length);
        var params = {
            login: login,
            filename: filename,
            links: links,
            obj: obj,
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
            others: {}
        }
        //console.log(params);
        if (arguments.length > 5) {
            console.log("MAGGIOREEEEE DI 5");
            var i = 5
            var k = 0
            while (i == arguments.length - 1) {
                //console.log(arguments[i]);
                params['others'][k] = arguments[i];
                i++; k++
            }
            //console.log("PARAMS: ", params)
        }
        //console.log("PARAMS: ", params)
        return params;
    }

    getParams(filename=false, links=false, obj=false, types=false,rows=false,users=false){
        return this.params(false,filename,links,types,rows,obj,false,false,false,false,false,false,false,false,users);
    }

    /**
     * 
     * @returns Object Sidebar {Name, link, active(bool), icon }
     */
    getSidebar() {
        var sidebar = [
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
            /* {
                'name': 'Appointments',
                'link': '/appointments',
                'active': false,
                'onClick': "",
                'icon': 'fas fa-calendar-check'
            },
            {
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

    myRender(res,filename,links,obj=false,types=false, rows=false, users=false) {
        return res.render(this.getTemplateIndex(),this.getParams(filename,links,obj,types,rows, users));
    }

};
module.exports = Template;
