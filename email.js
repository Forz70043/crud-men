var nodemailer = require('nodemailer');
var env = require('dotenv').config();
var Utils = require('./utils');
var utils = new Utils();

class Email {
	constructor(service='gmail'){
	
		this.service = service;
		this.email = process.env.APP_EMAIL;
		this.pass = process.env.APP_EMAIL_PASS;
		
		this.transporter = nodemailer.createTransport({
			service: this.service,
			auth: {
	    		user: this.email,
	    		pass: this.pass
	  		}
		});
		
		this.from = '';
		this.subject = '';
		this.to = '';
		this.text = '';
		this.html = '';
	}

	setService(service){
		this.service=service;
	}

	getService(){
		return this.service;
	}

	setTo(to){

		if(typeof(to)==='object'){

			for(var i=0; i<to.length; i++){
				
				if(utils.checkEmail(to[i])){
					this.to +=to[i];
					if(i!=(to.length-1)) this.to+=', ';
				}
			}
		}
		else if(typeof(to)==='string'){
			this.to = (utils.checkEmail(to)) ? to : process.env.APP_EMAIL ;
		}
	}

	getTo(){
		return this.to;
	}

	setSubject(subject){
		this.subject = subject;
	}
	
	getSubject(){
		return this.subject;
	}

	config(){
		return this.config;
	}

	setFrom(from){
		this.from = from;
	}
	getFrom(){
		return this.from;
	}
	setText(text){
		this.text=text;
	}
	getText(){
		return this.text;
	}

	setHtml(html){
		this.html = html;
	}

	getHtml(){
		return this.html;
	}

	getConfig(){
		if(this.config){
			return this.config;
		}
	}

	setConfig(html=false){
		if(html){
			this.config = {
				from: this.getFrom(),
				to: this.getTo(),
				subject: this.getSubject(),
				html: this.getHtml()
			}
		}
		else{
			this.config = {
				from: this.getFrom(),
				to: this.getTo(),
				subject: this.getSubject(),
				text: this.getText()
			}
		}
		
	}

	send(){

		this.transporter.sendMail(this.getConfig(), async (error, info)=>{
			console.log("DENTRO");
			if(error){
				console.log("ERR",error);
				new Error(error);
			}
			else{
				console.log("OK EMAIL")
				var info = await info.response;
				console.log("INFO ",info);
				return info;
			}
		})
	}

	createLink(userEmail){
		var link=process.env.ACTIVATION_LINK;

		//const buff = Buffer.from(userEmail, 'utf-8');
		//const base64 = buff.toString('base64');
		//console.log(base64)
		var base64 = utils.encodeBase64(userEmail);
		
		console.log(base64);

		link +='?activation='+base64

		console.log(link);
		return link;
	}

	emailNewUsers(userEmail){
		
		this.setFrom('wild.cloud.beer@gmail.com');
		
		if(utils.checkEmail(userEmail)){
			this.setTo(userEmail);
			this.setSubject('Doc. Medical Register');
			var text="Benvenuto "+userEmail+",\n\t\tUsa questo link per abilitare il tuo nuovo account: <a href='"+this.createLink(userEmail)+"'> Attivazione </a>";
			this.setHtml(text);
			this.setConfig(true);
			console.log("CONF: ",this.getConfig());
			var result = this.send();
			console.log(result);	
		}
		
	}

};
module.exports = Email;
