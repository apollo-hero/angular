import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare let navigator:any;

@Injectable()
export class GeoLocationService {
  movement;
  constructor(private http: HttpClient) {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        localStorage.setItem('storage.position', JSON.stringify({
          'lat': position.coords.latitude,
          'lng': position.coords.longitude,
          'accuracy': position.coords.accuracy,
          'altitude': position.coords.altitude,
          'altitudeAccuracy': position.coords.altitudeAccuracy,
          'heading': position.coords.heading,
          'speed': position.coords.speed
        }));
        navigator.geolocation.watchPosition(function(position){
          localStorage.setItem('storage.position', JSON.stringify({
            'lat': position.coords.latitude,
            'lng': position.coords.longitude,
            'accuracy': position.coords.accuracy,
            'altitude': position.coords.altitude,
            'altitudeAccuracy': position.coords.altitudeAccuracy,
            'heading': position.coords.heading,
            'speed': position.coords.speed
          }));
        }, function(error){
          console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }, { enableHighAccuracy: true });
      }, function(error){
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      }, { enableHighAccuracy: true });
    }
  }
  setPosition(position) {
    localStorage.setItem('storage.position', JSON.stringify({
      'lat': position.coords.latitude,
      'lng': position.coords.longitude,
      'accuracy': position.coords.accuracy,
      'altitude': position.coords.altitude,
      'altitudeAccuracy': position.coords.altitudeAccuracy,
      'heading': position.coords.heading,
      'speed': position.coords.speed
    }));
  }
  getDistance(x1, x2, y1, y2) {
    let DEG2RAD = 0.01745329252;
    let RAD2DEG = 57.29577951308;
    let EARTH_RADIUS = {
      kilometers: 6370.99056,
      meters: 6370990.56,
      miles: 3958.75,
      feet: 20902200,
      radians: 1,
      degrees: RAD2DEG
    };
    x1 = x1 * DEG2RAD;
    y1 = y1 * DEG2RAD;
    x2 = x2 * DEG2RAD;
    y2 = y2 * DEG2RAD;
    let haversine = function(a) {
      return Math.pow(Math.sin(a / 2.0), 2);
    };
    let f = Math.sqrt(haversine(x2 - x1) + Math.cos(x2) * Math.cos(x1) * haversine(y2 - y1));
    return {
      'head': ((Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) + 360) % 360,
      'radians': 2 * Math.asin(f) * EARTH_RADIUS['radians'],
      'kilometers': 2 * Math.asin(f) * EARTH_RADIUS['kilometers'],
      'meters': 2 * Math.asin(f) * EARTH_RADIUS['meters'],
      'miles': 2 * Math.asin(f) * EARTH_RADIUS['miles'],
      'feet': 2 * Math.asin(f) * EARTH_RADIUS['feet'],
      'degrees': 2 * Math.asin(f) * EARTH_RADIUS['degrees']
    };
  }
  flat(lat, lng) {
    let glOffset = Math.pow(2,28);
    let glRadius =  Math.pow(2,28) / Math.PI;
    let a = Math.pow(2,28);
    let b = 85445659.4471;
    let c = 0.017453292519943;
    let d = 0.0000006705522537;
    let e = Math.E
    let p = Math.PI / 180;
    return {
      x: Math.round(glOffset + glRadius * lng * p), 
      y: Math.round(glOffset - glRadius * Math.log((1 + Math.sin(lat * p)) / (1 - Math.sin(lat * p))) / 2)
    };
  }
  getMove(matrix) {
    if(this.movement) {
      if(this.movement.dx > 0 || this.movement.dy > 0) {
        this.movement = Object.assign(matrix, {dx : this.movement.dx + matrix.x - this.movement.x, dy: this.movement.dy + matrix.y - this.movement.y});
      } else {
        this.movement = matrix ? Object.assign(matrix, {dx : 0.01, dy: 0.01}) : {x:0, y:0, dx:0, dy:0};
      }
    } else {
      this.movement = matrix ? Object.assign(matrix, {dx : 0.01, dy: 0.01}) : {x:0, y:0, dx:0, dy:0};
    }
    return this.movement;
  }
  where(addr, polygon = 1) {
    return this.http.request('get', `https://nominatim.openstreetmap.org/search?q=${addr}&polygon=${polygon}&addressdetails=1&format=json`).toPromise()
  }
  reverse(lat, lng) {
    return this.http.request('get', `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`).toPromise()
  }
}
