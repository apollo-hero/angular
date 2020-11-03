import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')

@Component({
	selector: 'app-input-group',
	templateUrl: './input-group.component.html',
	styleUrls: ['./input-group.component.css']
})
export class InputGroupComponent implements OnInit {
	@Input() classGroup
	@Input() classInput
	@Input() type
	@Input() name
	@Input() placeholder
	@Input() required
	@Input() data
	@Input() model
	@Output() enter = new EventEmitter();
	@Output() doChange = new EventEmitter();
	id = shortid()
	constructor() {}

	ngOnInit() {}

	doEnter(attr) {
		this.enter.emit(attr)
	}
	change(attr) {
		this.doChange.emit(attr)
	}
}
