import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
	contact;
	constructor(private meta: Meta, private titleService: Title, private router: Router, private appServices: AppServices) { 
		let app = appServices.getLocal('app')
		if(app) {
			titleService.setTitle(`Contact | ${app.name}`);
			appServices.setCanonical();
		}
	}

	ngOnInit() {
	}

	doContact(data) {
		Object.assign(data, {deleted: false, applicationId: this.appServices.appcode})
		this.appServices.api('post', `contacts`, data).then((obj) => {
			let res = obj.response
			this.contact = res.data;
			this.appServices.api('post', `notifications/push/${this.appServices.appcode}`, {
				title: `Contact from ${data.name}`,
				body: data.message,
				action: '/admin/contact'
			}, false).catch((err) => {})
		}).catch((err) => {})
	}
}
