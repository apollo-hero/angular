import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';
import { NotifyService } from './../../addon/notify.service';

@Component({
	selector: 'app-my-history',
	templateUrl: './my-history.component.html',
	styleUrls: ['./my-history.component.css']
})
export class MyHistoryComponent implements OnInit {
	member;
	orders = []; page:any = {}
	filter = {deleted: false}
	couriers = []; pageCourier:any = {}
	filterCourier = {deleted: false}
	parcels = []; pageParcel:any = {}
	filterParcel = {deleted: false}
	quote_parcels = [];
	countryFrom; countryTo;
	suburbsFrom; suburbsTo;
	constructor(public router: Router, public appServices: AppServices, public relationService: RelationService, public notifyService: NotifyService) { }

	ngOnInit() {
		let session: any = this.appServices.session;
		this.appServices.api('get', null, {
			'model': `members/${session.uid}`,
		}, {notify: false}).then((obj) => {
			let res = obj.response.res;
			if(res.pagination.count > 0) {
				this.member = res.data[0];
				this.loadOrder();
			}
		}).catch((err) => {})
	}

	loadOrder(filter = {}, add = false) {
		if(!add) {
			this.page = {}
		}
		let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {memberId: this.member.id, applicationId: this.appServices.appcode}))
		this.appServices.api('get', null, {
			'model': `orders?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`,
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.relationService.link_model(res.data, 'courier', 'courierId', null, (res:any) => {
				let relate = res.data[0]
				this.appServices.api('get', null, {
					model: `companies/${relate.companyId}`
				}, {notify: false}).then(obj => {
					let res = obj.response.res
					Object.assign(relate, {company: res.data[0]})
				})
			})
			this.relationService.link_model(res.data, 'location', 'originalId', 'original')
			this.relationService.link_model(res.data, 'location', 'destinationId', 'destination')
			if(add) {
				this.orders = this.orders.concat(res.data);
			} else {
				this.orders = res.data
			}
			this.page = res.pagination
		}).catch((err) => {})
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
	loadCountryFrom(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `countries?${query}&filter[order][0]=name&filter[limit]=150`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.countryFrom = res.data.sort((a, b) => a.name.localeCompare(b.name))
		}).catch((err) => {})
	}
	loadCountryTo(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `countries?${query}&filter[order][0]=name&filter[limit]=150`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.countryTo = res.data.sort((a, b) => a.name.localeCompare(b.name))
		}).catch((err) => {})
	}
	loadSuburbFrom(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `suburbs?${query}&filter[order][0]=name&filter[limit]=50`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.suburbsFrom = res.data
		}).catch((err) => {})
	}
	loadSuburbTo(filter = {}) {
		let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
		this.appServices.api('get', null, {
			'model': `suburbs?${query}&filter[order][0]=nam&filter[limit]=50`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			this.suburbsTo = res.data
		}).catch((err) => {})
	}
	addParcel(data, frm) {
		if(frm['weight'] && frm['length'] && frm['width'] && frm['height']) {
			this.quote_parcels.push({
				type: 'box',
				weight: frm['weight'],
				length: frm['length'],
				width: frm['width'],
				height: frm['height'],
				qty: 1
			})
			frm['weight'] = frm['length'] = frm['width'] = frm['height'] = undefined
		}
	}
	doQuote(frm) {
		let data = frm.value;
		Object.assign(frm, {loading: true});
		if(data.parcels) {
			this.locationFrom(data, (original) => {
				this.locationTo(data, (destination) => {
					this.doOrder({
						originalId: original.id,
						destinationId: destination.id,
						pickup_type: data.pickup_type,
						drop_type: data.drop_type,
						currency: 'AUD'
					}, (order) => {
						data.parcels.map((el, indx) => {
							el = this.appServices.cleanForm(el)
							this.doParcel(Object.assign(el, {orderId: order.id}), () => {
								if(data.parcels.length - 1 == indx) {
									this.router.navigate(['/main/quotes', order.id])
								}
							})
						})
					})
				})
			})
		} else {
			this.notifyService.toast('Error', 'Please add your item by clicking on +Parcel', 'danger')
			Object.assign(frm, {loading: false});
		}
	}
	locationFrom(data, cb) {
		let latin = this.appServices.latinize(`${data.suburbFrom} ${data.countryFrom}`).replace(/-/g, ' ')
		let query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}})
		this.appServices.api('get', null, {
			'model': `locations?${query}&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			if(res.pagination.count) {
				cb(res.data[0])
			} else {
				this.appServices.api('post', `locations`, {
					deleted: false,
					address: `${data.suburbFrom} ${data.countryFrom}`,
					latin: latin
				}, {notify: false}).then((obj) => {
					let res = obj.response
					cb(res.data)
				}).catch((err) => {})
			}
		}).catch((err) => {})
	}
	locationTo(data, cb) {
		let latin = this.appServices.latinize(`${data.suburbTo} ${data.countryTo}`).replace(/-/g, ' ')
		let query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}})
		this.appServices.api('get', null, {
			'model': `locations?${query}&filter[order][0]=updated_dt DESC`
		}, {notify: false}).then((obj) => {
			let res = obj.response.res
			if(res.pagination.count) {
				cb(res.data[0])
			} else {
				this.appServices.api('post', `locations`, {
					deleted: false,
					address: `${data.suburbTo} ${data.countryTo}`,
					latin: latin
				}, {notify: false}).then((obj) => {
					let res = obj.response
					cb(res.data)
				}).catch((err) => {})
			}
		}).catch((err) => {})
	}
	doParcel(data, cb) {
		this.appServices.api('post', `parcels`, Object.assign(data, {deleted: false, unit_weight: 'gram', unit_dimension: 'cm'}), false).then((obj) => {
			let res = obj.response
			cb(res.data)
		}).catch((err) => {})
	}
	doOrder(data, cb) {
		data = Object.assign(data, {deleted: false, applicationId: this.appServices.appcode});
		if(this.member) {
			Object.assign(data, {memberId: this.member.id})
		}
		this.appServices.api('post', `orders`, data).then((obj) => {
			let res = obj.response
			cb(res.data)
		}).catch((err) => {})
	}
}
