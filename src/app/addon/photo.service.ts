import { Injectable } from '@angular/core';

declare var $:any;

@Injectable()
export class PhotoService {
  UNSPLASH = 'https://source.unsplash.com/';
  LOREMPIXEL = 'http://lorempixel.com/';
  constructor() { }

  getPhoto(callback, query = 'random', dimension = '300x400') {
    callback(this.UNSPLASH + dimension + '/?' + query);
    // callback(this.LOREMPIXEL + dimension.replace('x', '/') + '/' + query);
  }

}
