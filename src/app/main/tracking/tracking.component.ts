import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';

@Component({
	selector: 'app-tracking',
	templateUrl: './tracking.component.html',
	styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  track;
  order;

  constructor(public meta: Meta, public titleService: Title, public router: Router, public appServices: AppServices
    , public relationService: RelationService) {
    let app = appServices.getLocal('app')
    if (app) {
      titleService.setTitle(`Tracking | ${app.name}`);
      appServices.setCanonical();
    }
  }

  ngOnInit() {
  }

  doTracking(data) {
    let query = this.appServices.parseQuery({deleted: false, orderId: data.id})
    this.appServices.api('get', null, {
      model: `tracks?${query}filter[include][0][relation]=order&filter[include][1][relation]=parcel&filter[include][2][relation]=location&filter[order][0]=updated_dt DESC`,
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'order', 'orderId')
      this.relationService.link_model(res.data, 'parcel', 'parcelId')
      this.relationService.link_model(res.data, 'location', 'locationId')
      if (res.pagination.count > 0) {
        this.track = res.data[0]
      }
    }).catch((err) => {
    })
    this.appServices.api('get', null, {
      'model': `orders/${data.id}?filter[include][0][relation]=courier`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'courier', 'courierId')
      this.relationService.link_model(res.data, 'location', 'originalId', 'original')
      this.relationService.link_model(res.data, 'location', 'destinationId', 'destination')
      if (res.pagination.count > 0) {
        this.order = res.data[0]
        query = this.appServices.parseQuery({deleted: false, orderId: data.id})
        this.appServices.api('get', null, {
          model: `parcels?${query}&filter[order][0]=updated_dt DESC`,
        }, {notify: false}).then((obj) => {
          let res = obj.response.res
          console.log(res)
          if (res.pagination.count > 0) {
            Object.assign(this.order, {parcels: res.data})
          }
        }).catch((err) => {
        })
      }
    }).catch((err) => {
    })
  }
}
