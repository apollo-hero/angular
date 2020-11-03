import {Injectable} from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/messaging';

@Injectable()
export class FirebaseService {
  config = {
    apiKey: 'AIzaSyD19PqZRTYK9eFg0dt6WC8H6GnP4xVItu0',
    authDomain: 'cordova-29a90.firebaseapp.com',
    databaseURL: 'https://cordova-29a90.firebaseio.com',
    projectId: 'cordova-29a90',
    storageBucket: 'cordova-29a90.appspot.com',
    messagingSenderId: '380257037544',
    appId: '1:380257037544:android:9c974e58f22aa611'
  };
  messaging;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(this.config);
    }
    if (firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
      this.messaging.requestPermission().then(() => {
        this.messaging.getToken().then((token) => {
          if (token) {
            console.log(token);
          } else {
            console.log('No Instance ID token available. Request permission to generate one.');
          }
        }).catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
        });
      }).catch(function(err) {
        console.log('Unable to get permission to notify.', err);
      });
    }
  }

  getToken(callback) {
    this.messaging.getToken().then(function(token) {
      if (token) {
        callback(token);
      } else {
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  getMessage(callback) {
    this.messaging.onMessage((payload: any) => {
      callback(payload);
    });
  }

}
