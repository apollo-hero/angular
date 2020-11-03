import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

import {AuthService, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login';

import {AppServices} from './../../app.services';
import {RelationService} from './../../relation.service';
import {NotifyService} from './../../addon/notify.service';
import { ThrowStmt } from '@angular/compiler';

declare var YT: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  app;
  member;
  authService;
  parcels = [];
  parcel_type = [];
  track;
  order;
  countryFrom;
  countryTo;
  suburbsFrom;
  postalsFrom;
  suburbsTo;
  postalsTo;
  allCountry;
  allpostalFrom;
  allpostalTo;

  constructor(public meta: Meta, public titleService: Title, public router: Router, public appServices: AppServices
    ,         public relationService: RelationService, public notifyService: NotifyService) {
    setTimeout(() => {
      const app = appServices.getLocal('app');
      if (app) {
        titleService.setTitle(`Homepage | ${app.name}`);
        appServices.setCanonical();

        this.authService = new AuthService(new AuthServiceConfig([{
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(app.gg_oath_id)
        }, {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(app.fb_app_id)
        }]));
      }
    }, 500);
    const session: any = this.appServices.session;
    if (session.uid) {
      this.appServices.api('get', null, {
        model: `members/${session.uid}`
      }, {notify: false}).then(obj => {
        const res = obj.response.res;
        this.member = res.data[0];
      }).catch(err => {
      });
    }
  }

  ngOnInit() {

  }

  playVideo() {
    new YT.Player('hero-video', {
      videoId: 'KWSd9Us0XFc',
      events: {
        onReady: (event) => {
          event.target.playVideo();
          $('#player').toggleClass('bg-dark');
          $('.card-img-overlay').toggleClass('d-none');
        }
      }
    });
  }

  loadParcelType() {
    this.parcel_type = [{name: 'envelope'}, {name: 'satchel'}, {name: 'box'}, {name: 'pallet'}, {name: 'wine/beer/liquor'}, {name: 'flower'}, {name: 'tube'}, {name: 'crate'}, {name: 'carton contains liquid'}, {name: 'box contents fragile'}];
  }

  loadCountryFrom(filter = {}) {
    const query = this.appServices.parseQuery(Object.assign({deleted: false}, filter));
    this.appServices.api('get', 'country/get-all', {
    }, {notify: false}).then((obj) => {
      console.log(obj);
      const res = obj.response;
      this.countryFrom = res.sort((a, b) => a.name.localeCompare(b.name));
      this.allCountry = this.countryFrom;
    }).catch((err) => {
    });
  }

  selectCountryFrom(str){
    this.countryFrom = this.allCountry;
    this.countryFrom = this.countryFrom.filter(country => country.name.includes(str));
  }

  loadCountryTo(filter = {}) {
    const query = this.appServices.parseQuery(Object.assign({deleted: false}, filter));
    this.appServices.api('get', 'country/get-all', {
    }, {notify: false}).then((obj) => {
      const res = obj.response;
      this.countryTo = res.sort((a, b) => a.name.localeCompare(b.name));
    }).catch((err) => {
    });
  }

  selectCountryTo(str){
    this.countryTo = this.allCountry;
    this.countryTo = this.countryTo.filter(country => country.name.includes(str));
  }

  loadSuburbFrom(filter = {}) {
    const query = this.appServices.parseQuery(Object.assign({deleted: false}, filter));
    this.appServices.api('get', null, {
      model: `suburbs?${query}&filter[order][0]=name&filter[limit]=50`
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      this.suburbsFrom = res.data;
    }).catch((err) => {
    });
  }

  loadPostalFrom(id) {
    this.appServices.api('get', 'postcode/get-by-country/'+id, {
    }, {notify: false}).then((obj) => {
      const res = obj.response;
      console.log(res);
      this.postalsFrom = res;
      this.allpostalFrom = res;
    }).catch((err) => {
    });
  }

  selectPostalFrom(str){
    this.postalsFrom = this.allpostalFrom;
    this.postalsFrom = this.postalsFrom.filter(postal => postal.postCode.includes(str));
  }

  loadSuburbTo(filter = {}) {
    const query = this.appServices.parseQuery(Object.assign({deleted: false}, filter));
    this.appServices.api('get', null, {
      model: `suburbs?${query}&filter[order][0]=nam&filter[limit]=50`
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      this.suburbsTo = res.data;
    }).catch((err) => {
    });
  }

  loadPostalTo(id) {
    this.appServices.api('get', 'postcode/get-by-country/'+id, {
    }, {notify: false}).then((obj) => {
      const res = obj.response;
      console.log(res);
      this.postalsTo = res;
      this.allpostalTo = res;
    }).catch((err) => {
    });
  }

  selectPostalTo(str){
    this.postalsTo = this.allpostalTo;
    this.postalsTo = this.postalsTo.filter(postal => postal.postCode.includes(str));
  }

  addParcel(data, frm) {
    if (frm.parcel_type && frm.weight && frm.length && frm.width && frm.height && frm.qty) {
      this.parcels.push({
        type: frm.parcel_type,
        weight: frm.weight,
        length: frm.length,
        width: frm.width,
        height: frm.height,
        qty: frm.qty
      });
      frm.parcel_type = frm.weight = frm.length = frm.width = frm.height = frm.qty = undefined;
    }
  }

  doQuote(frm) {
    const data = frm.value;
    Object.assign(frm, {loading: true});
    if (data.parcels) {
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
              el = this.appServices.cleanForm(el);
              this.doParcel(Object.assign(el, {orderId: order.id}), () => {
                if (data.parcels.length - 1 == indx) {
                  this.router.navigate(['/main/quotes', order.id]);
                }
              });
            });
          });
        });
      });
    } else {
      this.notifyService.toast('Error', 'Please add your item by clicking on +Parcel', 'danger');
      Object.assign(frm, {loading: false});
    }
  }

  locationFrom(data, cb) {
    const latin = this.appServices.latinize(`${data.suburbFrom} ${data.countryFrom} ${data.postalFrom}`).replace(/-/g, ' ');
    const query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}});
    this.appServices.api('get', null, {
      model: `locations?${query}&filter[order][0]=updated_dt DESC`
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      if (res.pagination.count) {
        this.appServices.api('patch', null, {
          model: `locations/${res.data[0].id}`,
          body: {
            detail: {
              suburb: data.suburbFrom,
              country: data.countryFrom,
              postal: data.postalFrom
            }
          }
        }, {notify: false}, true).then(obj => {
          cb(res.data[0]);
        });
      } else {
        this.appServices.api('post', `locations`, {
          deleted: false,
          address: `${data.suburbFrom} ${data.countryFrom} ${data.postalFrom}`,
          detail: {
            suburb: data.suburbFrom,
            country: data.countryFrom,
            postal: data.postalFrom
          },
          latin
        }, {notify: false}).then((obj) => {
          const res = obj.response;
          cb(res.data);
        }).catch((err) => {
        });
      }
    }).catch((err) => {
    });
  }

  locationTo(data, cb) {
    const latin = this.appServices.latinize(`${data.suburbTo} ${data.countryTo} ${data.postalTo}`).replace(/-/g, ' ');
    const query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}});
    this.appServices.api('get', null, {
      model: `locations?${query}&filter[order][0]=updated_dt DESC`
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      if (res.pagination.count) {
        this.appServices.api('patch', null, {
          model: `locations/${res.data[0].id}`,
          body: {
            detail: {
              suburb: data.suburbTo,
              country: data.countryTo,
              postal: data.postalTo
            }
          }
        }, {notify: false}, true).then(obj => {
          cb(res.data[0]);
        });
      } else {
        this.appServices.api('post', `locations`, {
          deleted: false,
          address: `${data.suburbTo} ${data.countryTo} ${data.postalTo}`,
          detail: {
            suburb: data.suburbTo,
            country: data.countryTo,
            postal: data.postalTo
          },
          latin
        }, {notify: false}).then((obj) => {
          const res = obj.response;
          cb(res.data);
        }).catch((err) => {
        });
      }
    }).catch((err) => {
    });
  }

  doParcel(data, cb) {
    this.appServices.api('post', `parcels`, Object.assign(data, {
      deleted: false,
      unit_weight: 'gram',
      unit_dimension: 'cm'
    }), false).then((obj) => {
      const res = obj.response;
      cb(res.data);
    }).catch((err) => {
    });
  }

  doOrder(data, cb) {
    data = Object.assign(data, {deleted: false, applicationId: this.appServices.appcode});
    if (this.member) {
      Object.assign(data, {memberId: this.member.id});
    }
    this.appServices.api('post', `orders`, data).then((obj) => {
      const res = obj.response;
      cb(res.data);
    }).catch((err) => {
    });
  }

  doTracking(data) {
    let query = this.appServices.parseQuery({deleted: false, orderId: data.id});
    this.appServices.api('get', null, {
      model: `tracks?${query}filter[include][0][relation]=order&filter[include][1][relation]=parcel&filter[include][2][relation]=location&filter[order][0]=updated_dt DESC`,
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      this.relationService.link_model(res.data, 'order', 'orderId');
      this.relationService.link_model(res.data, 'parcel', 'parcelId');
      this.relationService.link_model(res.data, 'location', 'locationId');
      if (res.pagination.count > 0) {
        this.track = res.data[0];
      }
    }).catch((err) => {
    });
    this.appServices.api('get', null, {
      model: `orders/${data.id}?filter[include][0][relation]=courier`
    }, {notify: false}).then((obj) => {
      const res = obj.response.res;
      this.relationService.link_model(res.data, 'courier', 'courierId');
      this.relationService.link_model(res.data, 'location', 'originalId', 'original');
      this.relationService.link_model(res.data, 'location', 'destinationId', 'destination');
      if (res.pagination.count > 0) {
        this.order = res.data[0];
        query = this.appServices.parseQuery({deleted: false, orderId: data.id});
        this.appServices.api('get', null, {
          model: `parcels?${query}&filter[order][0]=updated_dt DESC`,
        }, {notify: false}).then((obj) => {
          const res = obj.response.res;
          if (res.pagination.count > 0) {
            Object.assign(this.order, {parcels: res.data});
          }
        }).catch((err) => {
        });
      }
    }).catch((err) => {
    });
  }

  doSignin(data) {
    Object.assign(data, {appcode: this.appServices.appcode});
    this.appServices.api('post', 'members/login', data).then((obj) => {
      const res = obj.response;
      this.updateNotify(res.data);
    }).catch((err) => {
    });
  }

  loginFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
      this.appServices.api('post', 'members/login', {
        email: data.email,
        sid: data.id,
        appcode: this.appServices.appcode
      }).then((obj) => {
        const res = obj.response;
        this.updateNotify(res.data);
      }).catch((err) => {
        if (err.err.statusText == 'Not Found') {
          this.doSignup({
            name: data.name,
            email: data.email,
            photo: data.photoUrl,
            fbid: data.id
          });
        }
      });
    });
  }

  loginGG() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.appServices.api('post', 'members/login', {
        email: data.email,
        sid: data.id,
        appcode: this.appServices.appcode
      }).then((obj) => {
        const res = obj.response;
        this.updateNotify(res.data);
      }).catch((err) => {
        if (err.err.statusText == 'Not Found') {
          this.doSignup({
            name: data.name,
            email: data.email,
            photo: data.photoUrl,
            ggid: data.id
          });
        }
      });
    });
  }

  doSignup(data) {
    Object.assign(data, {deleted: false, userId: this.appServices.privilege.client, appcode: this.appServices.appcode});
    this.appServices.api('post', `members/ext/signup`, data).then((obj) => {
      const res = obj.response;
      this.appServices.api('post', null, {
        model: `members/ext/signup`,
        body: Object.assign(data, {id: res.data.uid, pwd: res.data.pwd, is_sendmail: true, website: window.location.href})
      }, {notify: false}, true).then((obj) => {
        const res = obj.response;
        this.updateNotify(res.data);
      }).catch((err) => {
      });
    }).catch((err) => {
    });
  }

  updateNotify(data) {
    const notify = this.appServices.getLocal('notify');
    this.appServices.session = data;
    const headers = Object.assign(data, {appcode: this.appServices.appcode});
    this.appServices.setHeaders(headers);
    if (notify) {
      this.appServices.api('patch', null, {
        model: `members/${data.uid}`,
        body: {notify}
      }, true, true).then((obj) => {
        this.appServices.api('get', null, {
          model: `members/${data.uid}`
        }).then(obj => {
          const res = obj.response.res;
          this.member = res.data[0];
        }).catch(err => {
        });
      }).catch((err) => {
      });
    } else {
      this.appServices.api('get', null, {
        model: `members/${data.uid}`
      }).then(obj => {
        const res = obj.response.res;
        this.member = res.data[0];
      }).catch(err => {
      });
    }
  }
}
