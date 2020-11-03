import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import * as JsBarcode from 'jsbarcode';

@Component({
	selector: 'app-barcode',
	templateUrl: './barcode.component.html',
	styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit {
	@Input() bc_height = '92px'
	@Input() bc_format
	@Input() bc_value
	constructor() { }

	ngOnInit() {
		setTimeout(() => {
			this.initBarcode()
			$('.barcode').height(this.bc_height)
		}, 500)
	}

	initBarcode() {
		try {
			JsBarcode('.barcode').init();
		} catch(e) {}
	}
}
