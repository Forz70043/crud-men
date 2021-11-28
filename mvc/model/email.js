var nodemailer = require('nodemailer');
var env = require('dotenv').config();
var Utils = require('./utils');
var utils = new Utils();

class Email {
	constructor(service = 'gmail') {

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
		this.amp = '';
	}

	setService(service) {
		this.service = service;
	}

	getService() {
		return this.service;
	}

	setTo(to) {

		if (typeof (to) === 'object') {

			for (var i = 0; i < to.length; i++) {

				if (utils.checkEmail(to[i])) {
					this.to += to[i];
					if (i != (to.length - 1)) this.to += ', ';
				}
			}
		}
		else if (typeof (to) === 'string') {
			this.to = (utils.checkEmail(to)) ? to : process.env.APP_EMAIL;
		}
	}

	getTo() {
		return this.to;
	}

	setSubject(subject) {
		this.subject = subject;
	}

	getSubject() {
		return this.subject;
	}

	config() {
		return this.config;
	}

	setFrom(from) {
		this.from = from;
	}
	getFrom() {
		return this.from;
	}
	setText(text) {
		this.text = text;
	}
	getText() {
		return this.text;
	}

	setHtml(html) {
		this.html = html;
	}

	getHtml() {
		return this.html;
	}

	getAmp() {
		return this.amp;
	}

	setAmp(amp) {
		this.amp = amp;
	}

	getConfig() {
		if (this.config) {
			return this.config;
		}
	}

	setConfig(html = false, amp = false) {
		if (html) {
			this.config = {
				from: this.getFrom(),
				to: this.getTo(),
				subject: this.getSubject(),
				html: this.getHtml(),
			}
		}
		else if (amp) {
			this.config = {
				from: this.getFrom(),
				to: this.getTo(),
				subject: this.getSubject(),
				amp: this.getAmp()
			}
		} else {
			this.config = {
				from: this.getFrom(),
				to: this.getTo(),
				subject: this.getSubject(),
				text: this.getText()
			}
		}

	}

	send() {

		this.transporter.sendMail(this.getConfig(), async (error, info) => {
			console.log("DENTRO");
			if (error) {
				console.log("ERR", error);
				new Error(error);
			}
			else {
				console.log("OK EMAIL")
				var info = await info.response;
				console.log("INFO ", info);
				return info;
			}
		})
	}

	createLink(userEmail, operation) {

		switch (operation) {
			case 'activations':
				var link = process.env.ACTIVATION_LINK || 'localhost:3000/users/activations';
				console.log(link);

				var base64 = utils.encodeBase64(userEmail);
				console.log(base64);

				link += '?activation=' + base64

				console.log(link);
				return link;

			case 'changePass':
				var link = process.env.CHANGEPASS_LINK || 'localhost:3000/users/changePass';
				console.log(link);

				var base64 = utils.encodeBase64(userEmail);
				console.log(base64);

				link += '?changePass=' + base64

				console.log(link);
				return link;
		}

	}

	emailNewUsers(userEmail) {

		this.setFrom('wild.cloud.beer@gmail.com');
		var operation = 'activations'

		if (utils.checkEmail(userEmail)) {
			this.setTo(userEmail);
			this.setSubject('Shopping List Register');
			var text = "Benvenuto " + userEmail + ",\n\t\tUsa questo link per abilitare il tuo nuovo account: <a href='" + this.createLink(userEmail, operation) + "'> Attivazione </a>";
			this.setHtml(text);
			this.setConfig(true);
			console.log("CONF: ", this.getConfig());
			var result = this.send();
			console.log(result);
		}

	}

	emailChangePass(userEmail) {
		this.setFrom('wild.cloud.beer@gmail.com');
		var operation = 'changePass'

		if (utils.checkEmail(userEmail)) {
			this.setTo(userEmail);
			this.setSubject('DShopping List Support');
			var head = "<head><style>.button {background-color: #2196F3;border: none;padding: 15px 32px;"
				+ "text-align: center;text-decoration: none;display: inline-block;font-size: 16px;"
				+ "margin: 4px 2px;cursor: pointer;}</style></head>"
			var body = "Hai chiesto di ripristinare la password del tuo account Shopping List."
				+ "Fai clic sul pulsante in basso per farlo. Se non hai richiesto il ripristino della password, "
				+ "ignora pure questa email."
			var text = head + "<body><div style='border: 1px solid white;text-align:center;margin-right: 5%;margin-left: 5%;'><h2>Shopping List</h2><h3>Benvenuto "
				+ userEmail + ",</h3>" + "<h4>" + body + "</h4>"
				+ "<br> <br><button class='button'type=“button”><a style='color: white;'href='"
				+ this.createLink(userEmail, operation) +
				"'> Cambia Password </a></button></div></body>";
			this.setHtml(text);


			this.setConfig(true, false);
			console.log("CONF: ", this.getConfig());
			var result = this.send();
			console.log(result);
		}
	}
};
module.exports = Email;