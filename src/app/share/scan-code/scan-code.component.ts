import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')

@Component({
	selector: 'app-scan-code',
	templateUrl: './scan-code.component.html',
	styleUrls: ['./scan-code.component.css']
})
export class ScanCodeComponent implements OnInit {
	@Input() classGroup
	@Input() classInput
	@Input() type
	@Input() name
	@Input() placeholder
	@Input() required
	@Input() data
	@Input() model
	@Output() doScan = new EventEmitter();
	@Output() enter = new EventEmitter();
	id = shortid()
	constructor() {}

	ngOnInit() {}

	scan(attr) {
		this.data ? this.data[this.name] = attr : null;
		this.doScan.emit(attr)
	}
	doEnter(attr) {
		this.enter.emit(attr)
	}
}
