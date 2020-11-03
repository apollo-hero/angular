import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';

@Component({
	selector: 'app-setup-courier',
	templateUrl: './setup-courier.component.html',
	styleUrls: ['./setup-courier.component.css']
})
export class SetupCourierComponent implements OnInit {
	companies = []; page:any = {}
	filter = {deleted: false}
	couriers = []; pageCourier:any = {}
	filterCourier = {deleted: false}

	constructor(public appServices: AppServices, public relationService: RelationService) { }

	ngOnInit() {
		this.loadCompany();
	}

	loadCompany(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {applicationId: this.appServices.appcode}))
		this.appServices.api('get', null, {
			'model': `companies?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`,
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.companies = this.companies.concat(res.data);
			} else {
				this.companies = res.data
			}
			this.page = res.pagination
		}).catch((err) => {})
	}
	detailCourier(frm, filter = {}) {
		let query = this.appServices.parseQuery(filter)
		this.appServices.api('get', null, {
			model: `couriers?${query}`,
		}).then((obj) => {
			let res = obj.response.res
			if(res.pagination.count > 0) {
				this.appServices.assignFrm(frm, res.data[0])
			}
		}).catch((err) => {})
	}
	doSave(data) {
		data = this.appServices.cleanForm(data)
		data.code ? data.code = data.code.toString() : null;
		if(data.id) {
			data = (({ courier, ...o }) => o)(data)
			this.appServices.api('patch', null, {
				model: `companies/${data.id}`, 
				body: data
			}).then((obj) => {
				this.loadCompany()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `companies`, data).then((obj) => {
				this.loadCompany()
			}).catch((err) => {})
		}
	}
	saveCourier(data) {
		data = this.appServices.cleanForm(data)
		if(data.id) {
			data = (({ company, ...o }) => o)(data)
			this.appServices.api('patch', null, {
				model: `couriers/${data.id}`, 
				body: data
			}).then((obj) => {}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `couriers`, data).then((obj) => {}).catch((err) => {})
		}
	}
}
