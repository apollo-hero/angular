import { Injectable } from '@angular/core';

declare var $:any;
declare var L:any;

@Injectable()
export class LeafletService {
	tiles; map;
	constructor() {
	}

	init(layer = 'gmap') {
		if(layer == 'gmap') {
			// Enable leaflet
			this.tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&apistyle=s.t%3A3|s.e%3Al|p.v%3Aoff', {
				maxZoom: 18,
				subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
				detectRetina: true
			});
		} else if(layer == 'nightmap') {
			// Enable leaflet-src
			this.tiles = L.tileLayer('https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD19PqZRTYK9eFg0dt6WC8H6GnP4xVItu0&center={x},{y}&zoom={z}&maptype=roadmap&style=element:geometry%7Ccolor:0x242f3e&style=element:labels.text.fill%7Ccolor:0x746855&style=element:labels.text.stroke%7Ccolor:0x242f3e&style=feature:administrative%7Celement:geometry%7Cvisibility:off&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:poi%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:poi.park%7Celement:geometry%7Ccolor:0x263c3f&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x6b9a76&style=feature:road%7Celement:geometry%7Ccolor:0x38414e&style=feature:road%7Celement:geometry.stroke%7Ccolor:0x212a37&style=feature:road%7Celement:labels.icon%7Cvisibility:off&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x9ca5b3&style=feature:road.arterial%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:geometry%7Ccolor:0x746855&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x1f2835&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xf3d19c&style=feature:road.local%7Cvisibility:off&style=feature:transit%7Cvisibility:off&style=feature:transit%7Celement:geometry%7Ccolor:0x2f3948&style=feature:transit.station%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:water%7Celement:geometry%7Ccolor:0x17263c&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x515c6d&style=feature:water%7Celement:labels.text.stroke%7Ccolor:0x17263c&size=256x256', {
				maxZoom: 18,
				subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
				detectRetina: true
			});
		} else {
			this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				subdomains: ['a','b','c']
			});
		}
	}

	marker(elementId, center, zoom, geo = []) {
		let featureGroup = L.featureGroup(geo.map(el => L.marker(el.geo, el.options).bindPopup(el.popup)))
		if(elementId) {
			this.map = L.map(elementId, {center: L.latLng(center.lat, center.lng), zoom: zoom, layers: [this.tiles, featureGroup]});
		} else {
			this.map.eachLayer((layer) => {
				if(layer._latlng)
					this.map.removeLayer(layer);
			});
			this.map.addLayer(featureGroup);
		}
		this.map.fitBounds(featureGroup.getBounds());
	}
	path(elementId, center, zoom, geo = [], marker = null) {
		if(marker) {
			let featureGroup = L.featureGroup([L.marker(marker.geo, marker.options).bindPopup(marker.popup)])
			this.map = L.map(elementId, {center: L.latLng(center.lat, center.lng), zoom: zoom, layers: [this.tiles, featureGroup]});
		} else {
			this.map = L.map(elementId, {center: L.latLng(center.lat, center.lng), zoom: zoom, layers: [this.tiles]});
		}
		let polyline = L.polyline(geo).addTo(this.map);
		this.map.fitBounds(polyline.getBounds());
	}
	cluster(elementId, center, zoom, geo = [], cbMarker = function(a){}, cbCluster = function(a){}) {
		this.map = L.map(elementId, {center: L.latLng(center.lat, center.lng), zoom: zoom, layers: [this.tiles]});
		let markers = L.markerClusterGroup();
		if(geo.length == 0) {
			for (let i = 0; i < 100; i++) {
				let title = Math.random();
				let marker = L.marker(this.randomLatLng(this.map), { title: title });
				marker.bindPopup(`${title}`);
				markers.addLayer(marker);
			}
		} else {
			for (let i = 0; i < geo.length; i++) {
				let a = geo[i];
				let title = a[2];
				let marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
				marker.bindPopup(title);
				markers.addLayer(marker);
			}
		}
		markers.on('click', function(a) {
			cbMarker(a);
		});
		markers.on('clusterclick', function (a) {
			cbCluster(a);
		});
		this.map.addLayer(markers);
	}

	randomLatLng(map) {
		let bounds = map.getBounds(),
		southWest = bounds.getSouthWest(),
		northEast = bounds.getNorthEast(),
		lngSpan = northEast.lng - southWest.lng,
		latSpan = northEast.lat - southWest.lat;
		return L.latLng(southWest.lat + latSpan * Math.random(), southWest.lng + lngSpan * Math.random());
	}

}
