import { Injectable } from '@angular/core';
import { response, json } from 'express';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  FastwayKey = 'b273b06f5770481d382904b1278608df';

  constructor() {

  }
  FastwayPickupRF(fromPostcode) {
    return fetch(`https://au.api.fastway.org/v2/psc/pickuprf/${fromPostcode}/1?api_key=64145803562a60b6b30a72eef70f7559`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      return res.result.franchise_code;
    })
    .catch(err => console.log(err));
  }
  FastwayRF(City: string, suburb: string) {
    let countryCode = 1;
    switch (City.toLowerCase()) {
      case 'australia':
      countryCode = 1;
      break;
      case 'new zealand':
      countryCode = 6;
      break;
      case 'south africa':
      countryCode = 24;
      break;
      case 'ireland':
      countryCode = 11;
      break;
    }
    const temp = `https://au.api.fastway.org/v2/psc/listrfs?CountryCode=${countryCode}&api_key=b273b06f5770481d382904b1278608df`;
    return fetch(temp)
    .then(res => res.json())
    .then(res => res.result.filter(ele => {
      return ele.FranchiseName.toLowerCase() == suburb.toLowerCase();
    }))
    .then(res => {
      if (res.length > 0) {
        return res[0].FranchiseCode;
      } else {
        throw new Error('suburb is invalid');
      }
    }).catch(err => console.log(err));
  }
  async FastwayPSC({ suburbFrom, postalFrom, suburbTo, postalTo, deadWeight, length, width, height }) {
    const franchise = await this.FastwayPickupRF(postalFrom);
    // console.log(franchise)
    deadWeight = (deadWeight) ? `WeightInKg=${deadWeight / 1000}&` : '';
    length = (length) ? `LengthInCm=${length}&` : '';
    width = (width) ? `WidthInCm=${width}&` : '';
    height = (height) ? `HeightInCm=${height}&` : '';

    const query = `${franchise}/${suburbTo}${postalTo ? ('/' + postalTo) : ''}?${deadWeight}${length}${height}${width}api_key=${this.FastwayKey}`;
    // console.log(query)
    return fetch(`https://au.api.fastway.org/v3/psc/lookup/${query}`)
    .then(res => res.json()).catch(err => console.log(err));

  }
  async HunterPSC({ suburbFrom, postalFrom, suburbTo, postalTo, deadWeight, length, width, height }) {
    // let state = await this.HunterXState(suburbFrom, 2594, suburbTo, postalTo)
    const stateFrom = await this.CourierPleaseState(postalFrom, suburbFrom);
    const stateTo = await this.CourierPleaseState(postalTo, suburbTo);
    const payload = {
      customerCode: 'DUMMY',
      fromLocation: {
        suburbName: suburbFrom,
        postCode: postalFrom,
        state: stateFrom
      },
      toLocation: {
        suburbName: suburbTo,
        postCode: postalTo,
        state: stateTo
      },
      goods: [
      {
        pieces: 1,
        weight: deadWeight,
        width,
        height,
        depth: length,
        typeCode: 'ENV'
      }
      ]

    };
    const headers = {
      Authorization: 'Basic aHh3czpoeHdz',
      // "Access-Control-Allow-Headers": "X-Requested-With",
    };
    return fetch('https://sandbox.hunterexpress.com.au/sandbox/rest/hxws/quote/get-quote', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then(res => res.json()).catch(err => console.log(err));
  }
  FastwayCreate({
    parcels, rateCard, deadWeight, note, readyAt,
    suburbFrom, postalFrom, streetAddressFrom, phoneFrom, mailFrom, nameFrom, companyFrom,
    suburbTo, postalTo, streetAddressTo, phoneTo, mailTo, nameTo, companyTo,
  }) {
    const query1 = `LabelNumber=000000000000;000000000001&quantity=${parcels.length}&`;
    const query2 = `PickupStreet=${streetAddressFrom}&PickupSuburb=${suburbFrom}&PickupPostalCode=${postalFrom}&`;
    const query3 = `PickupDate=${readyAt}&RequirePrint=false&`;
    const key = `api_key=b273b06f5770481d382904b1278608df`;
    return fetch(`https://au.api.fastway.org/v2/collections/pickuprequest?countrycode=1&${query1}${query2}${query3}${key}`)
    .then(res => res.json());
  }

  SherpaLogin(cb) {
    return fetch('https://qa.deliveries.sherpa.net.au/api/1/oauth/token?grant_type=password&client_id=user&username=boon@sosdevelopment.com.au&password=test123', {
      method: 'POST',
      mode: 'cors',
    }).then(response => {
      cb();
    });
  }
  SherpaPSC({ sherpaOpt, addressFrom, addressTo }) {
    const query = `delivery?delivery_option=${sherpaOpt}&vehicle_id=1&pickup_address=${addressFrom}&delivery_address=${addressTo}`;
    return fetch(`https://qa.deliveries.sherpa.net.au:443/api/1/price_calculators/${query}`, {
      headers: {
        Authorization: 'Bearer ec369cde5a5b1d32528a6e4a18c85759'
      }
    }).then(response => response.json()).catch(err => console.log(err));
  }
  SherpaValidate({ deliverOption, from, suburbFrom, postalFrom, to, suburbTo, postalTo, deadWeight, note }) {
    const query = `validate?delivery_option=${deliverOption}&vehicle_id=1&pickup_address=${postalFrom}&delivery_address=${postalTo}&item_description=${note}`;
    return fetch(`https://qa.deliveries.sherpa.net.au:443/api/1/deliveries/${query}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ec369cde5a5b1d32528a6e4a18c85759',
        'X-App-Token': 'user_sherpa_web'
      }
    }).then(res => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    }).catch(err => console.log(err));
  }
  SherpaCreate({ sherpaOpt, addressFrom, addressTo, deadWeight, note, nameFrom, nameTo, phoneFrom, phoneTo, readyAt }) {
    const query1 = `?delivery_option=${sherpaOpt}&vehicle_id=1&pickup_address=${addressFrom}&delivery_address=${addressTo}&item_description=${note}&ready_at=${readyAt}`;
    const query2 = `&pickup_address_contact_name=${nameFrom}&pickup_address_phone_number=${phoneFrom}&delivery_address_contact_name=${nameTo}&delivery_address_phone_number=${phoneTo}&heaviest_item_weight=${deadWeight}&check_id=true`;
    return fetch(`https://qa.deliveries.sherpa.net.au:443/api/1/deliveries${query1}${query2}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ec369cde5a5b1d32528a6e4a18c85759',
        'X-App-Token': 'user_sherpa_web'
      }
    }).then(res => res.json()).catch(err => console.log(err));
  }
  SherpaLabel(code) {
    return fetch(`https://qa.deliveries.sherpa.net.au:443/api/1/deliveries/${code}/label`, {
      headers: {
        Authorization: 'Bearer ec369cde5a5b1d32528a6e4a18c85759'
      }
    }).catch(err => console.log(err));
  }
  CourierPleasePSC({ addressFrom, suburbFrom, postalFrom, addressTo, suburbTo, postalTo, parcels }) {
    const url = 'https://api-test.couriersplease.com.au/v1/domestic/quote';
    const items = parcels.map(ele => {
      return {
        quantity: ele.qty,
        length: ele.length,
        height: ele.height,
        width: ele.width,
        physicalWeight: ele.weight / 1000
      };
    });

    const headers = {
      Authorization: 'Basic MTEzMTE5MDQ0OjU4QTMzMkFFRjdDQzJBOTMxQzFFMEFDNkUwOEM2NzI4N0UyQUExMzgyOTk3QzYwMjAxRjFDRUM2MzJCOEJDMEQ=',
      'Content-Type': 'application/json'
    };
    const body = {
      fromSuburb: suburbFrom,
      fromPostcode: postalFrom,
      toSuburb: suburbTo,
      toPostcode: postalTo,
      items
    };
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }).then(res => res.json()).catch(err => console.log(err));
  }
  CourierPleaseState(postCode, suburb) {
    const url = `https://api-test.couriersplease.com.au/v1/locations?suburbOrPostcode=${postCode}`;
    const headers = {
      Authorization: 'Basic MTEzMTE5MDQ0OjU4QTMzMkFFRjdDQzJBOTMxQzFFMEFDNkUwOEM2NzI4N0UyQUExMzgyOTk3QzYwMjAxRjFDRUM2MzJCOEJDMEQ=',
      'Content-Type': 'application/json'
    };
    return fetch(url, {
      method: 'GET',
      headers
    }).then(res => res.json())
    .then(res => {
      // console.log(res)
      let state = null;
      res.data.forEach(ele => {
        // console.log(ele.Suburb.toLowerCase() == suburb.toLowerCase() && ele.Postcode == postCode)
        if (ele.Suburb.toLowerCase() == suburb.toLowerCase() && ele.Postcode == postCode) {
          state = ele.State;
        }
      });
      // console.log(state)
      return state;
    }).catch(err => console.log(err));
  }
  async CourierPleaseDomesticCreate({
    parcels, rateCard, deadWeight, note, readyAt,
    suburbFrom, postalFrom, streetAddressFrom, phoneFrom, mailFrom, nameFrom, companyFrom,
    suburbTo, postalTo, streetAddressTo, phoneTo, mailTo, nameTo, companyTo,
  }) {
    const url = 'https://api-test.couriersplease.com.au/v1/domestic/shipment/create';
    const items = parcels.map(ele => {
      console.log(ele.weight / 1000);
      return {
        quantity: ele.qty,
        length: ele.length,
        height: ele.height,
        width: ele.width,
        physicalWeight: ele.weight / 1000
      };
    });
    const stateFrom = await this.CourierPleaseState(postalFrom, suburbFrom);
    const stateTo = await this.CourierPleaseState(postalTo, suburbTo);
    console.log(stateFrom, stateTo);
    const headers = {
      Authorization: 'Basic MTEzMTE5MDQ0OjU4QTMzMkFFRjdDQzJBOTMxQzFFMEFDNkUwOEM2NzI4N0UyQUExMzgyOTk3QzYwMjAxRjFDRUM2MzJCOEJDMEQ=',
      'Content-Type': 'application/json'
    };
    const body = {
      pickupDeliveryChoiceID: null,
      pickupFirstName: nameFrom,
      pickupLastName: 'none',
      pickupCompanyName: companyFrom,
      pickupEmail: mailFrom,
      pickupAddress1: streetAddressFrom,
      pickupAddress2: streetAddressFrom,
      pickupSuburb: suburbFrom,
      pickupState: stateFrom,
      pickupPostcode: postalFrom,
      pickupPhone: phoneFrom,
      pickupIsBusiness: true,
      destinationDeliveryChoiceID: null,
      destinationFirstName: nameTo,
      destinationLastName: 'none',
      destinationCompanyName: companyTo,
      destinationEmail: mailTo,
      destinationAddress1: streetAddressTo,
      destinationAddress2: streetAddressTo,
      destinationSuburb: suburbTo,
      destinationState: stateTo,
      destinationPostcode: postalTo,
      destinationPhone: phoneTo,
      destinationIsBusiness: true,
      contactFirstName: 'Contact First',
      contactLastName: 'Contact Last',
      contactCompanyName: 'Contact Co.',
      contactEmail: 'boon@sosdevelopment.com.au',
      contactAddress1: '352 Contact St.',
      contactAddress2: '',
      contactSuburb: 'Rosehill',
      contactState: 'NSW',
      contactPostcode: '2142',
      contactPhone: '1300 361 000',
      contactIsBusiness: 'true',
      referenceNumber: 'abc-123',
      termsAccepted: true,
      dangerousGoods: false,
      rateCardId: rateCard,
      specialInstruction: 'Leave on front door.',
      isATL: false,
      readyDateTime: '2020-06-09 12:12 pm',
      items
    };
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }).then(res => res.json()).catch(err => console.log(err));
  }
  async UPSPSC({
    addressFrom, suburbFrom, postalFrom, countryFrom,
    addressTo, suburbTo, postalTo, countryTo,
    parcels, deadWeight, length, width, height }) {
    const CcodeFrom = 'AU';
    const CcodeTo = 'AU';
    const stateFrom = await this.CourierPleaseState(postalFrom, suburbFrom);
    const stateTo = await this.CourierPleaseState(postalTo, suburbTo);

    if (countryFrom.toLowerCase() != 'australia' || countryTo.toLowerCase() == 'australia') {
      // switch (countryFrom) {
        //   case "":

        // }
      }
    const body = {
        ShipmentRequest: {
          Shipment: {
            Description: 'test request ',
            Shipper: {
              Name: 'UPS AUSTRALIA',
              AttentionName: 'Yang',
              TaxIdentificationNumber: '12435678',
              Phone: {
                Number: '61428428895'
              },
              ShipperNumber: '9Y5012',
              Address: {
                AddressLine: '29 ALEXANDRA PLACE',
                City: 'MURARRIE',
                StateProvinceCode: 'QLD',
                PostalCode: '4172',
                CountryCode: 'AU'
              }
            },
            ShipTo: {
              Name: 'THE UPS STORE',
              AttentionName: 'THE UPS STORE',
              Phone: {
                Number: '+1 800-742-5877'
              },
              Address: {
                AddressLine: 'Test address',
                City: suburbTo,
                StateProvinceCode: stateFrom,
                PostalCode: postalTo,
                CountryCode: CcodeTo
              }
            },
            ShipFrom: {
              Name: 'MB LIVS',
              AttentionName: 'YANG',
              Phone: {
                Number: '03153930'
              },
              Address: {
                AddressLine: '29 ALEXANDRA PLACE',
                City: suburbFrom,
                StateProvinceCode: stateTo,
                PostalCode: postalTo,
                CountryCode: CcodeFrom
              }
            },
            PaymentInformation: {
              ShipmentCharge: {
                Type: '01',
                BillShipper: {
                  AccountNumber: '9Y5012'
                }
              }
            },
            Service: {
              Code: '07',
            },
            Package: [
            {
              Description: 'International Goods',
              Packaging: {
                Code: '02'
              },
              PackageWeight: {
                UnitOfMeasurement: {
                  Code: 'KGS'
                },
                Weight: deadWeight / 10
              },
              PackageServiceOptions: ''
            }
            ],
            ItemizedChargesRequestedIndicator: '',
            RatingMethodRequestedIndicator: '',
            TaxInformationIndicator: '',
            ShipmentRatingOptions: {
              NegotiatedRatesIndicator: ''
            }
          },
          LabelSpecification: {
            LabelImageFormat: {
              Code: 'GIF'
            }
          }
        }
      };
    const headers = {
        AccessLicenseNumber: '6D6CF51F51CFD6F5',
        Username: 'myfreightau',
        Password: 'Abcdef#123',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
    return fetch('https://onlinetools.ups.com/ship/v1/shipments?additionaladdressvalidation=city', {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify(body)
      }).then(res => res.json()).catch(err => console.log(err));
    }


  async HEXPSC({ addressFrom, suburbFrom, postalFrom, countryFrom,
                 addressTo, suburbTo, postalTo, countryTo,
                 parcels, deadWeight, length, width, height }) {

    const url = '/Api/PriceEstimate';
    const body = {
      CustomerName: '_API_TEST',
      CustomerCode: 'APITEST',
      SenderSuburb: suburbFrom,
      SenderPostcode: postalFrom,
      ReceiverName: 'Mr. Yang',
      ReceiverSuburb: suburbTo,
      ReceiverPostcode: postalTo,
      Rows: [
      {
        Qty: 4,
        QtyDecimal: 4,
        Description: 'box',
        Weight: deadWeight,
        Length: length,
        Width: width,
        Height: height,
        CubicQty: 2.0000,
        Reference: '',
        StockCode: '',
        Uom: 'kgs'
      }
    ]
    };
    const headers = {
      Authorization: '55010|XXLFNZRLPW',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    // @ts-ignore
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      headers: {
        Authorization: '55010|XXLFNZRLPW',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json()).catch(err => console.log(err));
  }

  async StarTrackPSC({ addressFrom, suburbFrom, postalFrom, countryFrom,
                 addressTo, suburbTo, postalTo, countryTo,
                 parcels, deadWeight, length, width, height }) {

    const url = 'https://digitalapi.auspost.com.au/test/shipping/v1/shipments';
    const body =  {
      shipments: [
        {
          shipment_reference: 'ARC-001-009',
          customer_reference_1: 'CUSS 001',
          customer_reference_2: 'SKU-1, SKU-2, SKU-3',
          email_tracking_enabled: true,
          from: {
            name: 'Boon Van Yang',
            lines: [
              '2903 Logan Road'
            ],
            suburb: 'Underwood',
            state: 'QLD',
            postcode: '4119',
            phone: '61428428895',
            email: 'boon@sosdevelopment.com.au'
          },
          to: {
            name: 'Jane Smith',
            business_name: 'Smith Pty Ltd',
            lines: [
              '15 Henry Street'
            ],
            suburb: 'Loganholme',
            state: 'QLD',
            postcode: '4129',
            phone: '61428428895',
            email: 'sanjoyd.cse@gmail.com'
          },
          items: [
            {
              item_reference: 'EXPRESS',
              packaging_type: 'ITM',
              product_id: 'EXP',
              length: '5',
              height: '5',
              width: '10',
              weight: '1',
              authority_to_leave: false,
              allow_partial_delivery: false,
              features: {
                TRANSIT_COVER: {
                  attributes: {
                    cover_amount: 250
                  }
                }
              }
            }
          ]
        }
      ]
    };
    const headers = {
      Authorization: 'Basic Nzc4MmFhNzMtMjZkZi00ZmFjLWIxMTctNTE2NmY2MDhiM2RiOngwMmIzZmIxYjEwM2I3NDRmMmM4',
      'account-number': '00925827',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    // @ts-ignore
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      redirect: 'follow',
      headers,
      body: JSON.stringify(body),
    })
      .then(res => res.json()).catch(err => console.log(err));
  }

  async HexPSCCreate({   parcels, rateCard, deadWeight, note, readyAt,
                       suburbFrom, postalFrom, streetAddressFrom, phoneFrom, mailFrom, nameFrom, companyFrom,
                       suburbTo, postalTo, streetAddressTo, phoneTo, mailTo, nameTo, companyTo, }) {
    const payload = {
      Date: readyAt,
      SenderName: nameFrom,
      SenderSuburb: suburbFrom,
      SenderPostcode: postalFrom,
      SenderState: 'QLD',
      ReceiverName: nameTo,
      ReceiverSuburb: suburbTo,
      ReceiverPostcode: postalTo,
      ReceiverState: 'QLD',
      Rows: [
        {
          Qty: 4,
          Description: 'Carton'
        },
        {
          Qty: 5,
          Description: 'BOX'
        }
      ]
    };
    const headers = {
      Authorization: '55010|XXLFNZRLPW',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    return fetch('/Api/Consignment', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then(res => res.json()).catch(err => console.log(err));
  }
  async StarTrackCreate({   parcels, rateCard, deadWeight, note, readyAt,
                       suburbFrom, postalFrom, streetAddressFrom, phoneFrom, mailFrom, nameFrom, companyFrom,
                       suburbTo, postalTo, streetAddressTo, phoneTo, mailTo, nameTo, companyTo, }) {
    const payload = {
      Date: readyAt,
      SenderName: nameFrom,
      SenderSuburb: suburbFrom,
      SenderPostcode: postalFrom,
      SenderState: 'QLD',
      ReceiverName: nameTo,
      ReceiverSuburb: suburbTo,
      ReceiverPostcode: postalTo,
      ReceiverState: 'QLD',
      Rows: [
        {
          Qty: 4,
          Description: 'Carton'
        },
        {
          Qty: 5,
          Description: 'BOX'
        }
      ]
    };
    const headers = {
      Authorization: '55010|XXLFNZRLPW',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    return fetch('/Api/Consignment', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then(res => res.json()).catch(err => console.log(err));
  }
  }
