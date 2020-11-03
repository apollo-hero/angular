import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	session;
	member;
	constructor(public router: Router, public appServices: AppServices) {}

	ngOnInit() {

		let token = this.appServices.getLocal("token");
		if(token) {
			
			this.appServices.api('get', 'get-user-by-token/'+token, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
				this.member = res;
				}
			}).catch((err) => {})
		}
		let name = this.appServices.getLocal("name");

		if (name){
			this.appServices.api('get', 'user/get-by-username/'+name, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
					this.member = res;
				}
			}).catch((err) => {})
		}

	}

	doSignout() {
		this.appServices.clear();
		this.router.navigate(['/main/home'])
	}
}
