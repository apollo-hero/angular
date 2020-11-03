import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

	constructor(private meta: Meta, private titleService: Title, private router: Router, private appServices: AppServices) { 
		let app = appServices.getLocal('app')
		if(app) {
			titleService.setTitle(`About | ${app.name}`);
			appServices.setCanonical();
		}
	}

	ngOnInit() {
		
	}

}
