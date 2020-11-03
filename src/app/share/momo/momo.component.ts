import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import qrcode from 'qrcode';

@Component({
	selector: 'app-momo',
	templateUrl: './momo.component.html',
	styleUrls: ['./momo.component.css']
})
export class MomoComponent implements OnInit {
	@Input() phone
	@Input() name
	@Input() email
	@Input() amount
	@Input() data
	scan; passphrase;
	constructor() { }

	ngOnInit() {
		qrcode.toDataURL(`2|99|${this.phone}|${this.name}|${this.email}|0|0|${this.amount}`).then(res => {
			this.scan = res;
			this.passphrase = Math.floor((Math.random()*1000000) + 1)
			this.data['passphrase'] = this.passphrase;
		}).catch(err => console.log(err))
	}

}
