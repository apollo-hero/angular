import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')

@Component({
	selector: 'app-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {
	@Input() name
	@Input() data
	@Input() display
	@Output() doChange = new EventEmitter();
	id = shortid()
	constructor() {}

	ngOnInit() {}

	change(attr) {
		this.doChange.emit(attr)
	}

}
