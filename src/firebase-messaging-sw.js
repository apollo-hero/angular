importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js');

firebase.initializeApp({
	apiKey: 'AIzaSyD19PqZRTYK9eFg0dt6WC8H6GnP4xVItu0',
	authDomain: 'cordova-29a90.firebaseapp.com',
	databaseURL: 'https://cordova-29a90.firebaseio.com',
	projectId: 'cordova-29a90',
	storageBucket: 'cordova-29a90.appspot.com',
	messagingSenderId: '380257037544',
	appId: '1:380257037544:android:9c974e58f22aa611'
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
	console.log(payload);
});
