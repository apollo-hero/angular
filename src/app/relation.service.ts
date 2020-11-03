import { Injectable } from '@angular/core';

import { AppServices } from './app.services';

@Injectable({
	providedIn: 'root'
})
export class RelationService {

  constructor(private appServices: AppServices) {
  }

  link_model(data, model, key, path = '', cb = function({}) {
  }) {
    data.map(el => {
      if (!el[model] && el[key]) {
        this.appServices.api('get', null, {
          'model': `${(model[model.length - 1] == 'y' && model[model.length - 2] != 'e') ? (model.substr(0, model.length - 1) + 'ie') : model}s/${el[key]}`
        }, {notify: false}).then((obj) => {
          let res = obj.response.res;
          Object.assign(el, {
            [path ? path : model]: res.data[0]
          })
          cb(res)
        }).catch((err) => {
        })
      }
    })
  }
}
