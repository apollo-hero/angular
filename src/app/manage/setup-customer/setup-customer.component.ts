import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { PasteService } from './../../addon/paste.service';

let moment = require('moment');

@Component({
	selector: 'app-setup-customer',
	templateUrl: './setup-customer.component.html',
	styleUrls: ['./setup-customer.component.css']
})
export class SetupCustomerComponent implements OnInit {
	customers = []; page:any = {}
	filter = {deleted: false}
	constructor(public router: Router, public appServices: AppServices, private pasteService: PasteService) { }

	ngOnInit() {
		this.doLoad();
	}
	doLoad(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {userId: this.appServices.privilege['client']}))
		this.appServices.api('get', null, {
			'model': `members?${query}filter[include][0][relation]=user&filter[order][0]=updated_dt DESC&page=${this.page.next}`
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.customers = this.customers.concat(res.data);
			} else {
				this.customers = res.data
			}
			this.page = res.pagination
		}).catch((err) => {})
	}
	doSave(data) {
		data = this.appServices.cleanForm(data)
		data.phone ? data.phone = data.phone.toString() : null;
		data.dob ? data.dob = moment(data.dob).toISOString() : null;
		Object.assign(data, {userId: this.appServices.privilege['client']})
		if(data.id) {
			data = (({ user, ...o }) => o)(data)
			this.appServices.api('patch', null, {
				'model': `members/${data.id}`,
				'body': data
			}, {notify: true}, true).then((obj) => {
				this.doLoad()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false, pwd: data.pwd.toString()})
			this.appServices.api('post', `members`, data).then((obj) => {
				let res = obj.response;
				this.appServices.api('post', null, {
					'model': `members`,
					'body': Object.assign(res.data, {pwd: data.pwd})
				}, {notify: true}, true).then((obj) => {
					this.doLoad()
				}).catch((err) => {})
			}).catch((err) => {})
		}
	}
	doForget(data) {
		this.appServices.api('get', null, {
			'model': `members?filter[where][email]=${data.email}&filter[order][0]=updated_dt DESC`
		}).then((obj) => {
			let res = obj.response.res
			if(res) {
				this.appServices.api('post', `members/forget/${this.appServices.appcode}/${data.email}`, {
					website: data.user.website
				}).then((obj) => {
					let res = obj.response
					this.appServices.api('post', null, {
						'model': `members/forget/${this.appServices.appcode}/${data.email}`,
						'body': {website: data.user.website, pwd: res.data.pwd}
					}, {notify: true}, true).then((obj) => {}).catch((err) => {})
				}).catch((err) => {})
			}
		}).catch((err) => {})
	}
}
