import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppServices } from './../../app.services';
import { RelationService } from './../../relation.service';

@Component({
	selector: 'app-complete',
	templateUrl: './complete.component.html',
	styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {
	order;
	constructor(public activatedroute: ActivatedRoute, public router: Router, public appServices: AppServices, public relationService: RelationService) {}

	ngOnInit() {
		let id = this.activatedroute.snapshot.params['id'];
		this.appServices.api('get', null, {
			'model': `orders/${id}`,
		}).then((obj) => {
			let res = obj.response.res;
			if(res.pagination.count > 0) {
				this.order = res.data[0];
			}
		}).catch((err) => {})
	}

}
