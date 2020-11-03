import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-my-menu',
	templateUrl: './my-menu.component.html',
	styleUrls: ['./my-menu.component.css']
})
export class MyMenuComponent implements OnInit {
	session;
	constructor(public router: Router, public appServices: AppServices) { }

	ngOnInit() {
		this.session = this.appServices.session;
	}

}
