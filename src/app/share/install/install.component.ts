import { Component, OnInit } from '@angular/core';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-install',
	templateUrl: './install.component.html',
	styleUrls: ['./install.component.css']
})
export class InstallComponent implements OnInit {
	deferredPrompt
	constructor(public appServices: AppServices) {
		let app = appServices.getLocal('app')
		if(app && app.pwa) {
			let link = document.createElement('link');
			link.rel = 'manifest';
			link.href = '/assets/manifest.json';
			document.head.appendChild(link);
		}
	}

	ngOnInit() {
		window.addEventListener('appinstalled', (evt) => {
			console.log('App Installed');
		});
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			this.deferredPrompt = e;
			let modal: any = $('#modalInstall')
			modal.modal('show')
		})
	}

	installApp() {
		this.deferredPrompt.prompt();
		this.deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User installing');
			} else {
				console.log('User dismissed');
			}
			this.deferredPrompt = null;
		});
	}
}
