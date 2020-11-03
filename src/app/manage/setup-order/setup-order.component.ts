import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';

let moment = require('moment');

@Component({
	selector: 'app-setup-order',
	templateUrl: './setup-order.component.html',
	styleUrls: ['./setup-order.component.css']
})
export class SetupOrderComponent implements OnInit {
	orders = []; page:any = {}
	filter = {deleted: false}
	tracks = []; pageTrack:any = {}
	filterTrack = {deleted: false}
	parcels = []; pageParcel:any = {}
	filterParcel = {deleted: false}
	locations = []; pageLocation:any = {}
	filterLocation = {deleted: false}
	order;
	constructor(public appServices: AppServices, public relationService: RelationService) { }

	ngOnInit() {
		this.loadOrder();
	}

	loadOrder(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {applicationId: this.appServices.appcode}))
		this.appServices.api('get', null, {
			'model': `orders?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`,
		}).then((obj) => {
			let res = obj.response.res
			this.relationService.link_model(res.data, 'courier', 'courierId', null, (res: any) => {
				let rel = res.data[0]
				this.appServices.api('get', null, {
					'model': `companies/${rel.companyId}`
				}, {notify: false}).then(obj => {
					let res = obj.response.res;
					if(res.pagination.count > 0){
						Object.assign(rel, {company: res.data[0]})						
					}
				}).catch(err => {})
			})
			this.relationService.link_model(res.data, 'location', 'originalId', 'original')
			this.relationService.link_model(res.data, 'location', 'destinationId', 'destination')
			if(add) {
				this.orders = this.orders.concat(res.data);
			} else {
				this.orders = res.data
			}
			console.log(this.orders)
			this.page = res.pagination
		}).catch((err) => {})
	}
	doSave(data) {
		Object.assign(data, {applicationId: this.appServices.appcode})
		data = this.appServices.cleanForm(data)
		data.code ? data.code = data.code.toString() : null;
		data.collect_date ? data.collect_date = moment(data.collect_date).toISOString() : null;
		if(data.id) {
			this.appServices.api('patch', null, {
				model: `orders/${data.id}`, 
				body: data
			}).then((obj) => {
				this.loadOrder()
			}).catch((err) => {})
		} else {
			Object.assign(data, {deleted: false})
			this.appServices.api('post', `orders`, data).then((obj) => {
				this.loadOrder()
			}).catch((err) => {})
		}
	}
	doDelete(data) {
		data.deleted = !data.deleted
		this.appServices.api('patch', null, {
			model: `orders/${data.id}`, 
			body: data
		}).then((obj) => {
			this.loadOrder();
		}).catch((err) => {})
	}
	loadTrack(filter = {}, add = false) {
		if(!add) {
			this.pageTrack = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filterTrack, filter))
		this.appServices.api('get', null, {
			model: `tracks?${query}filter[include][0][relation]=location&filter[order][0]=updated_dt DESC&page=${this.pageTrack.next}`,
		}).then((obj) => {
			let res = obj.response.res
			this.relationService.link_model(res.data, 'location', 'locationId')
			if(add) {
				this.tracks = this.tracks.concat(res.data);
			} else {
				this.tracks = res.data
			}
			this.pageTrack = res.pagination
		}).catch((err) => {})
	}
	loadLocation(filter = {}, add = false) {
		if(!add) {
			this.pageLocation = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filterLocation, filter))
		this.appServices.api('get', null, {
			model: `locations?${query}filter[order][0]=updated_dt DESC&page=${this.pageLocation.next}`,
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.locations = this.locations.concat(res.data);
			} else {
				this.locations = res.data
			}
			this.pageLocation = res.pagination
		}).catch((err) => {})
	}
	findLocation(data, cb) {
		let latin = this.appServices.latinize(data.address).replace(/-/g, ' ')
		let query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}})
		this.appServices.api('get', null, {
			'model': `locations?${query}&filter[order][0]=updated_dt DESC`
		}, false).then((obj) => {
			let res = obj.response.res
			if(res.pagination.count) {
				cb(res.data[0])
			} else {
				let latlng = data.latlng.split(',');
				if(latlng.length > 1) {
					this.appServices.api('post', `locations`, {
						deleted: false,
						address: data.address,
						latin: latin,
						lat: parseFloat(latlng[0]),
						lng: parseFloat(latlng[1])
					}, false).then((obj) => {
						let res = obj.response
						cb(res.data)
					}).catch((err) => {})
				}
			}
		}).catch((err) => {})
	}
	saveTrack(data) {
		data = this.appServices.cleanForm(data)
		this.findLocation(data, (res) => {
			if(data.id) {
				this.appServices.api('patch', null, {
					model: `tracks/${data.id}`, 
					body: {
						id: data.id,
						orderId: this.order.id,
						locationId: res.id
					}
				}).then((obj) => {
					this.loadTrack()
				}).catch((err) => {})
			} else {
				this.appServices.api('post', `tracks`, {
					deleted: false,
					orderId: this.order.id,
					locationId: res.id
				}).then((obj) => {
					this.loadTrack()
				}).catch((err) => {})
			}
		})
	}
	loadParcel(filter = {}, add = false) {
		if(!add) {
			this.pageParcel = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filterParcel, filter))
		this.appServices.api('get', null, {
			model: `parcels?${query}filter[order][0]=updated_dt DESC&page=${this.pageParcel.next}`,
		}).then((obj) => {
			let res = obj.response.res
			if(add) {
				this.parcels = this.parcels.concat(res.data);
			} else {
				this.parcels = res.data
			}
			this.pageParcel = res.pagination
		}).catch((err) => {})
	}
	saveParcel(data) {
		this.appServices.api('patch', null, {
			model: `parcels/${data.id}`, 
			body: data
		}).then((obj) => {
			this.loadParcel()
		}).catch((err) => {})
	}
}
