import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
// import { AuthService, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-register';
import { AppServices } from './../../app.services';
import { NotifyService } from './../../addon/notify.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	app; authService;
	constructor(public meta: Meta, public titleService: Title, public activatedroute: ActivatedRoute, public router: Router
		, public appServices: AppServices, public notifyService: NotifyService) { 
		this.app = appServices.getLocal('app')
		if(this.app) {
			titleService.setTitle(`Authenticate | ${this.app.name}`);
			appServices.setCanonical();

			this.authService = new AuthService(new AuthServiceConfig([{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider(this.app.gg_oath_id)
			}, {
				id: FacebookLoginProvider.PROVIDER_ID,
				provider: new FacebookLoginProvider(this.app.fb_app_id)
			}]))
		}
	}

	ngOnInit() {
		if(this.appServices.headers.get('uid')) {
			this.router.navigate(['/main/profile/', this.appServices.headers.get('uid')])
		}
	}

	doSignin(data) {
		Object.assign(data, {appcode: this.appServices.appcode})
		this.appServices.api('post', 'login/', data, {notify: false}).then((obj) => {
			let res = obj.response;
			this.updateNotify(res.data)
		}).catch((err) => {})
	}
	loginFB() {
		this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
			this.appServices.api('post', 'members/register', {
				email: data.email,
				sid: data.id,
				appcode: this.appServices.appcode
			}).then((obj) => {
				let res = obj.response;
				this.updateNotify(res.data)
			}).catch((err) => {
				if(JSON.stringify(err).includes('"status":404,"statusText":"Not Found"')) {
					this.doSignup({value: {
						name: data.name,
						email: data.email,
						photo: data.photoUrl,
						fbid: data.id
					}})
				}
			})
		});
	}
	loginGG() {
		this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
			this.appServices.api('post', 'members/register', {
				email: data.email,
				sid: data.id,
				appcode: this.appServices.appcode
			}).then((obj) => {
				let res = obj.response;
				this.updateNotify(res.data)
			}).catch((err) => {
				if(JSON.stringify(err).includes('"status":404,"statusText":"Not Found"')) {
					this.doSignup({value: {
						name: data.name,
						email: data.email,
						photo: data.photoUrl,
						ggid: data.id
					}})
				}
			})
		});
	}
	doSignup(frm) {
		let data = frm.value;
		data.roles = [{id:12}];console.log(data);
		//Object.assign(data, {deleted: false, userId: this.appServices.privilege['client'], appcode: this.appServices.appcode})
		this.appServices.api('post', `register`, data, frm).then((obj) => {
			console.log(obj.response);
			let res = obj.response
			this.appServices.setLocal("token",res.resetToken)
			this.updateNotify(data);
			this.appServices.session = data;
			this.router.navigate(['/main/profile/', res.id]);

			this.appServices.api('post', null, {
				model: `register`, 
				body: Object.assign(data, {id: res.data.uid, pwd: res.data.pwd, is_sendmail: true, website: window.location.href})
			}, frm, true).then((obj) => {
				console.log(obj.response);
				let res = obj.response
				this.updateNotify(res.data)
			}).catch((err) => {
				console.log(err);
			})
		}).catch((err) => {})
	}
	doForget(frm) {
		let data = frm.value;
		this.appServices.api('post', `members/forget/${this.appServices.appcode}/${data.email}`, {}, Object.assign(frm, {notify: false})).then((obj) => {
			let res = obj.response
			this.appServices.api('post', null, {
				'model': `members/forget/${this.appServices.appcode}/${data.email}`,
				'body': {pwd: res.data.pwd}
			}, frm, true).then((obj) => {
				this.notifyService.toast('Completed','An email has been sent to you with password reset instructions')
			}).catch((err) => {})
		}).catch((err) => {})
	}
	updateNotify(data) {
		Object.assign(data, {appcode: this.appServices.appcode})
		this.appServices.api('post', 'authenticate', data, {notify: false}).then((obj) => {
			let res = obj.response;
			console.log(res);
			this.appServices.setLocal("auth_token",res.token);
		}).catch((err) => {})
	}
}
