import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')

@Component({
	selector: 'app-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
	@Input() name
	@Input() data
	@Input() value
	@Input() display
	@Output() doChange = new EventEmitter();
	id = shortid()
	constructor() {}

	ngOnInit() {}

	change(attr) {
		this.doChange.emit(attr)
	}
}
