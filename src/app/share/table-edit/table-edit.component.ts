import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-table-edit',
	templateUrl: './table-edit.component.html',
	styleUrls: ['./table-edit.component.css']
})
export class TableEditComponent implements OnInit {
	@Input() data
	@Input() field
	@Output() enter = new EventEmitter();

	constructor() { }

	ngOnInit() {

	}

	doEdit(attr) {
		attr.disabled = false
	}
	doEnter(attr) {
		this.enter.emit(this.data)
		attr.disabled = true
	}
}
