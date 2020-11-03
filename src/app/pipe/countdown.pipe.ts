import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return moment.utc(moment.duration(moment(value).diff(moment())).asMilliseconds()).format('HH:mm:ss');
  }

}
