import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';
import { TransportService } from "../../addon/transport.service"
import { evaluate } from 'mathjs'
let moment = require('moment');

@Component({
	selector: 'app-quotes',
	templateUrl: './quotes.component.html',
	styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  member;
  order;
  parcels = [];
  type;
  countryFrom;
  countryTo;
  suburbsFrom;
  postalsFrom;
  suburbsTo;
  postalsTo;
  addressBookFrom;
  addressBookTo;
  couriers = [];
  page: any = {}
  filter = {deleted: false}
  services = [];
  sherpaOpt;
  selected;
  CPRateCard;

  constructor(public activatedroute: ActivatedRoute, public router: Router, public appServices: AppServices
    , public relationService: RelationService, public transport: TransportService) {
  }

  ngOnInit() {
    let id = this.activatedroute.snapshot.params['id'];
    let session: any = this.appServices.session;
    this.appServices.api('get', null, {
      'model': `members/${session.uid}`
    }, {notify: false}).then(obj => {
      let res = obj.response.res
      this.member = res.data[0]
    }).catch(err => {
    })
    this.loadOrder(id)
    this.loadParcel(id)
    this.loadCourier()
  }

  loadOrder(id) {
    this.appServices.api('get', null, {
      'model': `orders/${id}`
    }).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'location', 'originalId', 'original', () => {
        this.relationService.link_model(res.data, 'location', 'destinationId', 'destination', () => {
          this.transport.SherpaLogin(() => {
            this.getServices()
          })
        })
      })
      this.order = res.data[0]
      if (!('dangerous' in this.order)) {
        Object.assign(this.order, {dangerous: false})
      }
    }).catch(err => {
    })
  }

  loadParcel(orderId) {
    let query = this.appServices.parseQuery({deleted: false, orderId: orderId})
    this.appServices.api('get', null, {
      'model': `parcels?${query}`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.parcels = res.data
    }).catch(err => {
    })
  }

  getServices() {
    console.log(this.order)
    const queryData = {
      addressFrom: this.order.original.address,
      suburbFrom: this.order.original.detail ? this.order.original.detail.suburb : '',
      postalFrom: this.order.original.detail ? this.order.original.detail.postal : '',
      countryFrom: this.order.original.detail ? this.order.original.detail.country : '',

      addressTo: this.order.destination.address,
      suburbTo: this.order.destination.detail ? this.order.destination.detail.suburb : '',
      postalTo: this.order.destination.detail ? this.order.destination.detail.postal : '',
      countryTo: this.order.destination.detail ? this.order.destination.detail.country : '',

      deadWeight: this.parcels[0].weight,
      length: this.parcels[0].length,
      width: this.parcels[0].width,
      height: this.parcels[0].height,
      parcels: this.parcels,
      parcel_type: this.type,
      note: "MyFreight Company"
    }
    this.transport.UPSPSC(queryData).then(res => {
      this.couriers.forEach((ele, index) => {
        if (ele.company.name == "UPS") {
          this.couriers[index]["price"] = res.result;
          this.couriers[index]["available"] = true;
          this.CPRateCard = res.data[0]["RateCardCode"];
        }
      })
      console.log("UPS DONE")
    })
    this.transport.FastwayPSC(queryData).then(res => {
      this.couriers.forEach((ele, index) => {
        if (ele.company.name == 'Fastway') {
          this.couriers[index].price = 88;// res.result.services[0].totalprice_normal;
          this.couriers[index].available = true;
          this.couriers[index].tracking = true;
          // this.CPRateCard = res.data[0]["RateCardCode"];
          this.CPRateCard = '666';
        }
      })
      console.log('FASTWAY DONE');
    });
    this.transport.CourierPleasePSC(queryData).then(res => {
      this.couriers.forEach((ele, index) => {
        if (ele.company.name == "Courier Please") {
          this.couriers[index].price = 122;
          this.couriers[index].available = true;
          this.couriers[index].tracking = true;
          this.CPRateCard = '344';
        }
      })
      console.log("CP DONE");
    })
    this.transport.HEXPSC(queryData).then(res => {
      console.log(res);
      this.couriers.forEach((ele, index) => {
        if (ele.company.name == 'Hunter Express') {
          this.couriers[index].price = res.Data.Rows[0].BasePrice;
          this.couriers[index].available = true;
          this.couriers[index].tracking = true;
          this.CPRateCard = '666';
        }
      })
      console.log(this.couriers);
      console.log('HEX DONE');
    })
    this.transport.StarTrackPSC(queryData).then(res => {
      console.log(res);
      this.couriers.forEach((ele, index) => {
        if (ele.company.name == 'Startrack') {
          this.couriers[index].price = 600;
          this.couriers[index].available = true;
          this.couriers[index].tracking = true;
          this.CPRateCard = '666';
        }
      })
      console.log('AUSPOST DONE');
    })

    const SherpaOpt = [0, 1, 2]
    SherpaOpt.forEach(deliOpt => {
      this.transport.SherpaPSC({sherpaOpt: deliOpt, ...queryData}).then(res => {
        if (!res["error"]) {
          this.couriers.forEach((ele, index) => {
            if (ele.delivery_time == deliOpt && ele.company.name == "Sherpa") {
              this.couriers[index].price = res.price
              this.couriers[index].currency = res.currency
              this.couriers[index].available = true;
            }
          })
        }
      }).catch(err => console.log(err))
    })
  }

  loadCourier(filter = {}, add = false) {
    if (!add) {
      this.page = {}
    }
    let query = '';
    if (filter['order']) {
      let order = this.appServices.parseQuery(filter['order'], 'filter[order]')
      delete filter['order']
      query = order;
    } else {
      query = 'filter[order][0]=updated_dt DESC&'
    }
    query += this.appServices.parseQuery(Object.assign(this.filter, filter, {applicationId: this.appServices.appcode}))
    return this.appServices.api('get', null, {
      'model': `couriers?${query}filter[include][0][relation]=company&page=${this.page.next}`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'company', 'companyId')
      if (add) {
        this.couriers = this.couriers.concat(res.data);
      } else {
        this.couriers = res.data
      }
      this.page = res.pagination
    }).catch((err) => {
    })
  }

  loadCountryFrom(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `countries?${query}&filter[order][0]=name&filter[limit]=150`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.countryFrom = res.data
    }).catch((err) => {
    })
  }

  loadCountryTo(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `countries?${query}&filter[order][0]=name&filter[limit]=150`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.countryTo = res.data
    }).catch((err) => {
    })
  }

  loadSuburbFrom(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `suburbs?${query}&filter[order][0]=name`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.suburbsFrom = res.data
    }).catch((err) => {
    })
  }

  loadPostalFrom(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `postals?${query}filter[include][0][relation]=country&filter[order][0]=code&filter[limit]=50`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'country', 'countryId')
      this.postalsFrom = res.data
    }).catch((err) => {
    })
  }

  loadSuburbTo(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `suburbs?${query}&filter[order][0]=nam&filter[limit]=50`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.suburbsTo = res.data
    }).catch((err) => {
    })
  }

  loadPostalTo(filter = {}) {
    let query = this.appServices.parseQuery(Object.assign({deleted: false}, filter))
    this.appServices.api('get', null, {
      'model': `postals?${query}filter[include][0][relation]=country&filter[order][0]=code&filter[limit]=50`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      this.relationService.link_model(res.data, 'country', 'countryId')
      this.postalsTo = res.data
    }).catch((err) => {
    })
  }

  chooseCourier(data) {
    switch (data.company.name) {
      case "Sherpa":
        this.selected = "SHERPA"
        this.sherpaOpt = data.delivery_time
        break;
      case "Courier Please":
        this.selected = "CP"
        break;
      case "Fastway":
        this.selected = "Fastway"
        break;
    }
    data = this.appServices.cleanForm(data)
    Object.assign(this.order, {
      courierId: data.id,
      currency: data.currency,
      insurance: data.insurance + (data.addInsurance ? data.addInsurance : 0),
      delivery_time: data.delivery_time,
      delivery_unit: data.delivery_unit,
      price: data.price
      // price: evaluate(`${data.insurance + (data.addInsurance ? data.addInsurance : 0)} * (1 + ${data.commission.includes('%') ? data.commission.replace(/%/g, '*0.01') : data.commission})`)
    })
    this.appServices.api('patch', null, {
      model: `orders/${this.order.id}`,
      body: (({original, destination, ...o}) => o)(this.order)
    }, {notify: false}).then((obj) => {
      let res = obj.response
    }).catch((err) => {
    })
  }

  doFinal(data) {
    data.collect_date ? data.collect_date = moment(data.collect_date).toISOString() : null;
    const quoteData = {
      rateCard: this.CPRateCard,// for cp
      parcels: this.parcels,// for cp
      sherpaOpt: this.sherpaOpt,//for sherpa
      // FROM INFO
      addressFrom: this.order.original.address,
      streetAddressFrom: data.addressFrom,
      suburbFrom: this.order.original.detail ? this.order.original.detail.suburb : '',
      postalFrom: this.order.original.detail ? this.order.original.detail.postal : '',
      countryFrom: this.order.original.detail ? this.order.original.detail.country : '',
      nameFrom: data.contact_from,
      mailFrom: data.email_from,
      phoneFrom: data.phone_from,
      companyFrom: data.company_from,
      //TO INFO
      addressTo: this.order.destination.address,
      streetAddressTo: data.addressTo,
      suburbTo: this.order.destination.detail ? this.order.destination.detail.suburb : '',
      postalTo: this.order.destination.detail ? this.order.destination.detail.postal : '',
      countryTo: this.order.destination.detail ? this.order.destination.detail.country : '',
      nameTo: data.contact_to,
      phoneTo: data.phone_to,
      mailTo: data.email_to,
      companyTo: data.company_to,

      deadWeight: this.parcels[0].weight,
      note: data.note_from,

      readyAt: data.collect_date || "30/06/2020"
    }

    console.log('Selected company : ' + this.selected);
    switch (this.selected) {
      case "SHERPA":
        this.transport.SherpaCreate(quoteData).then(res => {
          let label = res.id;
          let ordercode = res ? res.delivery_tracking.token : data.code;
          this.locationFrom(data, (original) => {
            this.locationTo(data, (destination) => {
              this.doOrder({
                label: label,
                code: ordercode,
                brief: original.brief,
                originalId: original.id,
                destinationId: destination.id,
                contact_from: data.contact_from,
                phone_from: data.phone_from,
                email_from: data.email_from,
                company_from: data.company_from,
                collect_date: data.collect_date,
                pick_door: data.pick_door,
                note_from: data.note_from,
                contact_to: data.contact_to,
                phone_to: data.phone_to,
                email_to: data.email_to,
                company_to: data.company_to,
                authority_leave: data.authority_leave,
                note_to: data.note_to
              })
            })
          })
        }).catch(err => console.log(err))
        break;
      case "CP":
        this.transport.CourierPleaseDomesticCreate(quoteData).then(res => {
          // let ordercode = res ? res.delivery_tracking.token : data.code
          let ordercode = res ? res.data.consignmentCode : data.code
          this.locationFrom(data, (original) => {
            this.locationTo(data, (destination) => {
              this.doOrder({
                code: ordercode,
                brief: original.brief,
                originalId: original.id,
                destinationId: destination.id,
                contact_from: data.contact_from,
                phone_from: data.phone_from,
                email_from: data.email_from,
                company_from: data.company_from,
                collect_date: data.collect_date,
                pick_door: data.pick_door,
                note_from: data.note_from,
                contact_to: data.contact_to,
                phone_to: data.phone_to,
                email_to: data.email_to,
                company_to: data.company_to,
                authority_leave: data.authority_leave,
                note_to: data.note_to
              })
            })
          })
        }).catch(err => {
        })
        break;
      case "Fastway":
        this.transport.FastwayCreate(quoteData).then(res => {
          let ordercode = "000000000000"
          this.locationFrom(data, (original) => {
            this.locationTo(data, (destination) => {
              this.doOrder({
                code: ordercode,
                brief: original.brief,
                originalId: original.id,
                destinationId: destination.id,
                contact_from: data.contact_from,
                phone_from: data.phone_from,
                email_from: data.email_from,
                company_from: data.company_from,
                collect_date: data.collect_date,
                pick_door: data.pick_door,
                note_from: data.note_from,
                contact_to: data.contact_to,
                phone_to: data.phone_to,
                email_to: data.email_to,
                company_to: data.company_to,
                authority_leave: data.authority_leave,
                note_to: data.note_to
              })
            })
          })
        }).catch(err => {
        })
        break;
      case 'Hunter Express':
        this.transport.HexPSCCreate(quoteData).then(res => {
          console.log(quoteData);
          const ordercode = '000000000000'
          this.locationFrom(data, (original) => {
            this.locationTo(data, (destination) => {
              this.doOrder({
                code: ordercode,
                brief: original.brief,
                originalId: original.id,
                destinationId: destination.id,
                contact_from: data.contact_from,
                phone_from: data.phone_from,
                email_from: data.email_from,
                company_from: data.company_from,
                collect_date: data.collect_date,
                pick_door: data.pick_door,
                note_from: data.note_from,
                contact_to: data.contact_to,
                phone_to: data.phone_to,
                email_to: data.email_to,
                company_to: data.company_to,
                authority_leave: data.authority_leave,
                note_to: data.note_to
              });
            });
          });
        }).catch(err => {
        })
        break;
      case 'Startrack':
        this.transport.StarTrackCreate(quoteData).then(res => {
          console.log(quoteData);
          const ordercode = '000000000000'
          this.locationFrom(data, (original) => {
            this.locationTo(data, (destination) => {
              this.doOrder({
                code: ordercode,
                brief: original.brief,
                originalId: original.id,
                destinationId: destination.id,
                contact_from: data.contact_from,
                phone_from: data.phone_from,
                email_from: data.email_from,
                company_from: data.company_from,
                collect_date: data.collect_date,
                pick_door: data.pick_door,
                note_from: data.note_from,
                contact_to: data.contact_to,
                phone_to: data.phone_to,
                email_to: data.email_to,
                company_to: data.company_to,
                authority_leave: data.authority_leave,
                note_to: data.note_to
              });
            });
          });
        }).catch(err => {
        })
        break;
    }


    this.doSignup({
      name: data.contact_from,
      email: data.email_from
    }, () => {
      this.doSignup({
        name: data.contact_to,
        email: data.email_to
      })
    })
  }

  doSignup(data, cb = function() {
  }) {
    try {
      Object.assign(data, {deleted: false, userId: this.appServices.privilege['client'], appcode: this.appServices.appcode})
      this.appServices.api('post', `members/ext/signup`, data, {notify: false}).then((obj) => {
        let res = obj.response
        this.appServices.api('post', null, {
          model: `members/ext/signup`,
          body: Object.assign(data, {id: res.data.uid, pwd: res.data.pwd, is_sendmail: true, website: window.location.href})
        }, {notify: false}, true).then((obj) => {
          let res = obj.response
        }).catch((err) => {
        })
      }).catch((err) => {
      })
    } catch (e) {
    }
    cb()
  }

  loadAddressBookFrom(filter = {}, add = false) {
    if (this.member) {
      if (!add) {
        this.page = {}
      }
      let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {memberId: this.member.id}))
      this.appServices.api('get', null, {
        'model': `locations?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`
      }).then((obj) => {
        let res = obj.response.res
        if (res.pagination.count > 0) {
          if (add) {
            this.addressBookFrom = this.addressBookFrom.concat(res.data);
          } else {
            this.addressBookFrom = res.data
          }
        }
      }).catch((err) => {
      })
    }
  }

  loadAddressBookTo(filter = {}, add = false) {
    if (this.member) {
      if (!add) {
        this.page = {}
      }
      let query = this.appServices.parseQuery(Object.assign(this.filter, filter, {memberId: this.member.id}))
      this.appServices.api('get', null, {
        'model': `locations?${query}filter[order][0]=updated_dt DESC&page=${this.page.next}`
      }).then((obj) => {
        let res = obj.response.res
        if (res.pagination.count > 0) {
          if (add) {
            this.addressBookTo = this.addressBookFrom.concat(res.data);
          } else {
            this.addressBookTo = res.data
          }
        }
      }).catch((err) => {
      })
    }
  }

  locationFrom(data, cb) {
    let latin = this.appServices.latinize(`${data.addressFrom}${data.suburbFrom ? (' ' + data.suburbFrom) : ''}`).replace(/-/g, ' ')
    let query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}})
    this.appServices.api('get', null, {
      'model': `locations?${query}&filter[order][0]=updated_dt DESC`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      if (res.pagination.count) {
        this.appServices.api('patch', null, {
          'model': `locations/${res.data[0].id}`,
          'body': {
            detail: {
              suburb: data.suburbFrom,
              country: data.countryFrom,
              postal: data.postalFrom
            }
          }
        }, {notify: false}, true).then(obj => {
          cb(res.data[0])
        })
      } else {
        this.appServices.api('post', `locations`, {
          deleted: false,
          address: `${data.addressFrom} ${data.suburbFrom ? data.suburbFrom : ''}`,
          latin: latin,
          memberId: this.member ? this.member.id : ''
        }, {notify: false}).then((obj) => {
          let res = obj.response
          cb(res.data)
        }).catch((err) => {
        })
      }
    }).catch((err) => {
    })
  }

  locationTo(data, cb) {
    let latin = this.appServices.latinize(`${data.addressTo}${data.suburbTo ? (' ' + data.suburbTo) : ''}`).replace(/-/g, ' ')
    let query = this.appServices.parseQuery({deleted: false, latin: {ilike: latin}})
    this.appServices.api('get', null, {
      'model': `locations?${query}&filter[order][0]=updated_dt DESC`
    }, {notify: false}).then((obj) => {
      let res = obj.response.res
      if (res.pagination.count) {
        this.appServices.api('patch', null, {
          'model': `locations/${res.data[0].id}`,
          'body': {
            detail: {
              suburb: data.suburbTo,
              country: data.countryTo,
              postal: data.postalTo
            }
          }
        }, {notify: false}, true).then(obj => {
          cb(res.data[0])
        })
      } else {
        this.appServices.api('post', `locations`, {
          deleted: false,
          address: `${data.addressTo} ${data.suburbTo ? data.suburbTo : ''}`,
          latin: latin,
          memberId: this.member ? this.member.id : ''
        }, {notify: false}).then((obj) => {
          let res = obj.response
          cb(res.data)
        }).catch((err) => {
        })
      }
    }).catch((err) => {
    })
  }

  saveParcel(data) {
    data = this.appServices.cleanForm(data)
    if (data.id) {
      this.appServices.api('patch', null, {
        model: `parcels/${data.id}`,
        body: data
      }).then((obj) => {
        this.loadParcel(this.order.id)
      }).catch((err) => {
      })
    } else {
      Object.assign(data, {deleted: false, orderId: this.order.id, unit_weight: 'gram', unit_dimension: 'cm'})
      this.appServices.api('post', `parcels`, data).then((obj) => {
        this.loadParcel(this.order.id)
      }).catch((err) => {
      })
    }
  }

  doOrder(data) {
    this.appServices.api('patch', null, {
      model: `orders/${this.order.id}`,
      body: data
    }, {notify: false}).then((obj) => {
      let res = obj.response
      this.router.navigate(['/main/complete/', this.order.id])
    }).catch((err) => {
    })
  }
}
