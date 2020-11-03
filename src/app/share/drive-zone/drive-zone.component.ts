import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { AppServices } from './../../app.services';
declare var gapi:any;

const CLIENT_ID = '380257037544-qurd55mdu33cagc2e8o2hin2pq3jqr0d.apps.googleusercontent.com';
const API_KEY = 'AIzaSyD19PqZRTYK9eFg0dt6WC8H6GnP4xVItu0';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive';

@Component({
	selector: 'app-drive-zone',
	templateUrl: './drive-zone.component.html',
	styleUrls: ['./drive-zone.component.css']
})
export class DriveZoneComponent implements OnInit {
	@Input() files = []
	@Output() uploaded = new EventEmitter();
	uploading = false;
	constructor(private appServices: AppServices) { 
		let signInJS = document.createElement('script');
		signInJS.async = true;
		signInJS.src = 'https://apis.google.com/js/api.js';
		signInJS.onload = onload;
		document.head.appendChild(signInJS);
	}

	ngOnInit() {
		setTimeout(() => {
			gapi.load('client:auth2', () => {
				gapi.client.init({
					apiKey: API_KEY,
					clientId: CLIENT_ID,
					discoveryDocs: DISCOVERY_DOCS,
					scope: SCOPES
				}).then(function () {
					console.log('drive loaded')
				}, function(err) {
					console.log(err)
				});
			});
		}, 2000)
	}

	uploadDrive() {
		if(!gapi.auth2.getAuthInstance().isSignedIn.get()) {
			gapi.auth2.getAuthInstance().signIn({
				prompt: 'consent'
			})
		} else {
			this.files.map((file, indx) => {
				let metadata = {
					'name': file.name,
					'mimeType': file.type
				};
				file = new Blob([file], {type: file.type});
				let form = new FormData();
				form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
				form.append('file', file);
				this.uploading = true
				let accessToken = gapi.auth.getToken().access_token;
				fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,size', {
					method: 'POST',
					headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
					body: form,
				}).then(res => {
					res.json().then(obj => {
						gapi.client.drive.permissions.create({
							fileId: obj.id,
							resource: {
								role: 'reader',
								type: 'anyone',
								allowFileDiscovery: true
							}
						}).then(res => {
							if(file.type.includes('image')) {
								this.uploaded.emit(`https://drive.google.com/uc?export=download&id=${obj.id}`)
							} else if(file.type.includes('audio')) {
								this.uploaded.emit(`https://drive.google.com/uc?export=download&id=${obj.id}`)
							} else if(file.type.includes('video')) {
								this.uploaded.emit(`https://drive.google.com/file/d/${obj.id}/preview`)
							}
							if(indx == this.files.length - 1) {
								this.uploading = false
								this.files = []
							}
						}).catch(err => {
							console.log(err)
						});
					})
				});
			})
		}
	}
	uploadShare() {
		this.files.map((file, indx) => {
			if(file.type.includes('video')) {
				let reader = new FileReader();
				reader.readAsDataURL(file); 
				reader.onloadend = () => {
					let base64 = reader.result;
					this.appServices.api('post', 'basics/video', {
						'base64': base64
					}).then(obj => {
						let data = obj.response.data.data
						this.uploaded.emit(data.link)
					}).catch(err => console.log(err))
				}
			} else if(file.type.includes('image')) {
				file = new Blob([file], {type: file.type});
				let reader = new FileReader();
				reader.readAsDataURL(file); 
				reader.onloadend = () => {
					let base64 = reader.result;
					this.appServices.api('post', 'basics/photo', {
						'base64': base64
					}).then(obj => {
						let data = obj.response.data
						this.uploaded.emit(data.path)
					}).catch(err => console.log(err))
				}
			}
		})
	}
	onSelect(event) {
		this.files.push(...event.addedFiles);
	}
	onRemove(event) {
		this.files.splice(this.files.indexOf(event), 1);
	}
}
