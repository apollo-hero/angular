import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';

let moment = require('moment');

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	member;
	suburbs; postals;
	bill_suburbs; bill_postals;
	constructor(private meta: Meta, private titleService: Title, private activatedroute: ActivatedRoute, private router: Router
		, public appServices: AppServices, public relationService: RelationService) { }

	ngOnInit() {
		this.loadMember();
	}

	loadMember() {
		let id = this.activatedroute.snapshot.params['id'];
		let token = this.appServices.getLocal("token");
		let name = this.appServices.getLocal("name");
		if (token){
			this.appServices.api('get', 'get-user-by-token/'+token, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
					this.member = res;
				}
			}).catch((err) => {})
		}
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
	doSave(data) {
		console.log(data);
		this.appServices.api('put', `user/update`, data, {notify: false}).then((obj) => {
			console.log(obj.response);
			let res = obj.response;
			this.ngOnInit();
		}).catch((err) => {})
	}
	changePWD(data) {
		
		this.appServices.api('post', null, {
			'model': `members/changePWD/${this.appServices.appcode}/${data.id}`,
			'body': {
				pwd1: data.pwd1,
				pwd2: data.pwd2,
				website: data.user.website
			}
		}, {notify: true}, true).then((obj) => {}).catch((err) => {})
	}
	doSignout() {
		this.appServices.clear();
		window.location.href = '/main/home';
	}
	loadSuburb(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `suburbs?${query}&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.suburbs = res.data
		}).catch((err) => {})
	}
	loadPostal(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `postals?${query}filter[include][0][relation]=country&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.relationService.link_model(res.data, 'country', 'countryId')
			this.postals = res.data
		}).catch((err) => {})
	}
	loadSuburbBill(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `suburbs?${query}&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.bill_suburbs = res.data
		}).catch((err) => {})
	}
	loadPostalBill(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `postals?${query}filter[include][0][relation]=country&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.relationService.link_model(res.data, 'country', 'countryId')
			this.bill_postals = res.data
		}).catch((err) => {})
	}
}
