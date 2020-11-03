import { Component, OnInit } from '@angular/core';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	app;
	constructor(private appServices: AppServices) { 
		setTimeout(() => {
			this.app = appServices.getLocal('app')
		}, 500)
	}

	ngOnInit() {
	}

}
