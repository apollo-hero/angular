import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { PasteService } from './../../addon/paste.service';

@Component({
	selector: 'app-setup-location',
	templateUrl: './setup-location.component.html',
	styleUrls: ['./setup-location.component.css']
})
export class SetupLocationComponent implements OnInit {
	countries = []; page:any = {}
	filter = {deleted: false}
	suburbs = []; pageSuburb:any = {}
	filterSuburb = {deleted: false}
	postals = []; pagePostal:any = {}
	filterPostal = {deleted: false}
	constructor(public router: Router, public appServices: AppServices, private pasteService: PasteService) { }

	ngOnInit() {
		this.loadCountry();
	}

	loadCountry(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter))
		this.appServices.api('get', null, {
			'model': `countries?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.countries = this.countries.concat(res.data);
			} else {
				this.countries = res.data
			}
			this.page = res.pagination
		}).catch((err) => {})
	}
	saveCountry(data) {
		data = this.appServices.cleanForm(data)
		if(data.id) {
			this.appServices.api('patch', null, {
				model: `countries/${data.id}`, 
				body: data
			}).then((obj) => {
				this.loadCountry()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `countries`, data).then((obj) => {
				this.loadCountry()
			}).catch((err) => {})
		}
	}
	loadSuburb(filter = {}, add = false) {
		if(!add) {
			this.pageSuburb = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filterSuburb, filter))
		this.appServices.api('get', null, {
			'model': `suburbs?${query}filter[order][0]=updated_dt DESC&page=${this.pageSuburb.next}`
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.suburbs = this.suburbs.concat(res.data);
			} else {
				this.suburbs = res.data
			}
			this.pageSuburb = res.pagination
		}).catch((err) => {})
	}
	saveSuburb(data) {
		data = this.appServices.cleanForm(data)
		if(data.id) {
			this.appServices.api('patch', null, {
				model: `suburbs/${data.id}`, 
				body: data
			}).then((obj) => {
				this.loadSuburb()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `suburbs`, data).then((obj) => {
				this.loadSuburb()
			}).catch((err) => {})
		}
	}
	loadPostal(filter = {}, add = false) {
		if(!add) {
			this.pagePostal = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filterPostal, filter))
		this.appServices.api('get', null, {
			'model': `postals?${query}filter[order][0]=updated_dt DESC&page=${this.pagePostal.next}`
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.postals = this.postals.concat(res.data);
			} else {
				this.postals = res.data
			}
			this.pagePostal = res.pagination
		}).catch((err) => {})
	}
	savePostal(data) {
		data = this.appServices.cleanForm(data)
		if(data.id) {
			this.appServices.api('patch', null, {
				model: `postals/${data.id}`, 
				body: data
			}).then((obj) => {
				this.loadPostal()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `postals`, data).then((obj) => {
				this.loadPostal()
			}).catch((err) => {})
		}
	}
}
