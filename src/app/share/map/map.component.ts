import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	@Input() classGroup
	@Input() classEmbed = 'embed-responsive-16by9'
	@Input() query
	@Input() placeholder
	@Input() required
	@Input() name
	@Input() data
	@Input() route = []
	@Output() enter = new EventEmitter();
	id = shortid()
	constructor() {}

	ngOnInit() {
		if(this.route.length > 2) {
			this.route[1] = this.route.map((el, indx) => indx > 0 ? el : null).filter(n=>n).join('+to:')
			this.route = [this.route[0], this.route[1]]
		}
	}

	doEnter(attr) {
		this.query = attr.target.value;
		this.enter.emit(attr)
	}
}
