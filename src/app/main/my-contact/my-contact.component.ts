import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-my-contact',
	templateUrl: './my-contact.component.html',
	styleUrls: ['./my-contact.component.css']
})
export class MyContactComponent implements OnInit {
	contacts = []; page:any = {}
	filter = {deleted: false}
	constructor(public appServices: AppServices) { }

	ngOnInit() {
		Object.assign(this.filter, {
			applicationId: this.appServices.appcode
		})
		this.doLoad();
	}

	doLoad(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter))
		this.appServices.api('get', null, {
			'model': `contacts?${query}&filter[include][0][relation]=application&filter[order][0]=updated_dt DESC&page=${this.page.next}`
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.contacts = this.contacts.concat(res.data);
			} else {
				this.contacts = res.data
			}
			this.page = res.pagination
		}).catch((err) => {})
	}
	doResponse(data, frm) {
		data = this.appServices.cleanForm(data)
		this.appServices.api('post', `contacts/answer/${this.appServices.appcode}/${data.id}`, data).then(obj => {
			this.appServices.api('get', null, {
				'model': `contacts/${data.id}`
			}).then((obj) => {
				let res = obj.response.res;
				Object.assign(frm, res.data[0])
			}).catch((err) => {})
		}).catch(err => {})
	}
}
