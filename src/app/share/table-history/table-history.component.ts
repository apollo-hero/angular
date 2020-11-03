import { Component, OnInit, Input } from '@angular/core';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-table-history',
	templateUrl: './table-history.component.html',
	styleUrls: ['./table-history.component.css']
})
export class TableHistoryComponent implements OnInit {
	@Input() when
	@Input() who
	_who = ''
	constructor(private appServices: AppServices) { }

	ngOnInit() {
		if(this.who) {
			let query = this.appServices.parseQuery({id: this.who})
			this.appServices.api('get', null, {
				'model': `members?${query}`,
			}, false).then((obj) => {
				let res = obj.response.res
				if(res) {
					this._who = res.data[0].name
				}
			}).catch(err => {})
		}
	}
}
