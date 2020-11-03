import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';
import { PasteService } from './../../addon/paste.service';

@Component({
  selector: 'app-setup-address',
  templateUrl: './setup-address.component.html',
  styleUrls: ['./setup-address.component.css']
})
export class SetupAddressComponent implements OnInit {
  id;
  member;
  addresses;
  locations = [];
  page: any = {}
  filter = {deleted: false}

  constructor(public router: Router, public appServices: AppServices, private pasteService: PasteService) {
  }

  ngOnInit() {
    let token = this.appServices.getLocal("token");
		let name = this.appServices.getLocal("name");
		if (token){
			this.appServices.api('get', 'get-user-by-token/'+token, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
          this.id = res.id;
          this.appServices.api('get', 'address-book/user/'+this.id, {
          }, {notify: false}).then((obj) => {
            console.log(obj);
            let res = obj.response;
            if(res) {
              this.addresses = res;
              console.log(this.addresses);
            }
          }).catch((err) => {})
				}
			}).catch((err) => {})
		}
		if (name){
			this.appServices.api('get', 'user/get-by-username/'+name, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
          this.id = res.id;
          this.appServices.api('get', 'address-book/user/'+this.id, {
          }, {notify: false}).then((obj) => {
            console.log(obj);
            let res = obj.response;
            if(res) {
              this.addresses = res;
              console.log(this.addresses);
            }
          }).catch((err) => {})
				}
			}).catch((err) => {})
		}
  }

  loadMember() {
		let token = this.appServices.getLocal("token");
		let name = this.appServices.getLocal("name");
		if (token){
			this.appServices.api('get', 'get-user-by-token/'+token, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
					this.id = res.id;
				}
			}).catch((err) => {})
		}
		if (name){
			this.appServices.api('get', 'user/get-by-username/'+name, {
			}, {notify: false}).then((obj) => {
				console.log(obj);
				let res = obj.response;
				if(res) {
					this.id = res.id;
				}
			}).catch((err) => {})
		}

	}

  doLoad(filter = {}, add = false) {
    if (!add) {
      this.page = {}
    }
    const query = this.appServices.parseQuery(Object.assign(this.filter, filter, {memberId: this.member.id}))
    this.appServices.api('get', null, {
      model: `locations?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`
    }).then((obj) => {
      let res = obj.response.res
      if (res.pagination.count > 0) {
        if (add) {
          this.locations = this.locations.concat(res.data);
        } else {
          this.locations = res.data
        }
        this.page = res.pagination
      }
    }).catch((err) => {
    })
  }

  doSave(data) {
    console.log(data);
    Object.assign(data, {type: 'RESIDENTIAL',status:'ACTIVE'});
    this.appServices.api('post', `address-book`, data, {notify: false}).then((obj) => {
			console.log(obj.response);
      let res = obj.response
      this.ngOnInit();
		}).catch((err) => {})
  }
}
