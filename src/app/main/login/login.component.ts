import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AuthService, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { AppServices } from './../../app.services';
import { NotifyService } from './../../addon/notify.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
		console.log(data);
		//Object.assign(data, {appcode: this.appServices.appcode})
		this.appServices.api('post', 'authenticate', data, {notify: false}).then((obj) => {
			let res = obj.response;
			console.log(res);
			this.appServices.setLocal("auth_token",res.token);
			this.appServices.api('get','user/get-by-username/'+data.username,{},{notify:false})
			.then((object) =>{
				let res1 = object.response
				this.appServices.setLocal("name",res1.username);
				this.router.navigate(['/main/profile/', res1.id]);

			})
			this.updateNotify(res)
		}).catch((err) => {})
	}
	loginFB() {
		this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
			this.appServices.api('post', 'members/login', {
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
			this.appServices.api('post', 'members/login', {
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
		Object.assign(data, {deleted: false, userId: this.appServices.privilege['client'], appcode: this.appServices.appcode})
		this.appServices.api('post', `members/ext/signup`, data, frm).then((obj) => {
			let res = obj.response
			this.appServices.api('post', null, {
				model: `members/ext/signup`, 
				body: Object.assign(data, {id: res.data.uid, pwd: res.data.pwd, is_sendmail: true, website: window.location.href})
			}, frm, true).then((obj) => {
				let res = obj.response
				this.updateNotify(res.data)
			}).catch((err) => {})
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
		let token = this.appServices.getLocal('token');
		this.appServices.session = data
		let headers = Object.assign(data, {appcode: this.appServices.appcode})
		this.appServices.setHeaders(headers)
		if(token) {
			this.appServices.api('patch', null, {
				'model': `members/${data.id}`,
				'body': {token: token}
			}, {notify: true}, true).then((obj) => {
				this.router.navigate(['/main/profile/', data.id])
			}).catch((err) => {})
		} else {
			this.router.navigate(['/main/profile/', data.id])
		}
	}
}
