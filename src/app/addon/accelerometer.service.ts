import { Injectable }    from '@angular/core';

declare var navigator:any;

@Injectable()
export class AccelerometerService {
  constructor() {
    if(navigator.accelerometer) {
      navigator.accelerometer.getCurrentAcceleration(function(acceleration){
        localStorage.setItem('storage.accelerometer', JSON.stringify({
          'x': (acceleration.x).toFixed(2),
          'y': (acceleration.y).toFixed(2),
          'z': (acceleration.z).toFixed(2)
        }));
        navigator.accelerometer.watchAcceleration(function(acceleration){
          localStorage.setItem('storage.accelerometer', JSON.stringify({
            'x': (acceleration.x).toFixed(2),
            'y': (acceleration.y).toFixed(2),
            'z': (acceleration.z).toFixed(2)
          }));
        }, function(error){
          console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }, {frequency: 3000});
      }, function(error){
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      }, {frequency: 3000});
    }
  }
  setAccelerometer(acceleration) {
    localStorage.setItem('storage.accelerometer', JSON.stringify({
      'x': acceleration.x,
      'y': acceleration.y,
      'z': acceleration.z
    }));
  }
}
