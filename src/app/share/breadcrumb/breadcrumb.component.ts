import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
	@Input() url;
	current;
	breadcrumbs = [];
	constructor(public router: Router, private appServices: AppServices) {
		let local = this.appServices.getLocal('breadcrumbs')
		if(local) {
			this.breadcrumbs = local
		}
	}

	ngOnInit() {
		let foundRoute: any = this.router.config.find(f => `/${f.path}` == this.url)
		let sort = this.breadcrumbs.findIndex(f => f.path == this.url)
		if(foundRoute && sort < 0) {
			this.breadcrumbs.push({
				path: this.url,
				name: foundRoute.name
			});
			this.breadcrumbs = this.breadcrumbs.filter(n=>n)
			this.appServices.setLocal('breadcrumbs', this.breadcrumbs)
		} else if(sort >= 0) {
			let route = this.breadcrumbs[sort]
			this.breadcrumbs.splice(sort, 1)
			this.breadcrumbs.push(route)
		}
	}

}
