import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import { NotifyService } from './../../addon/notify.service';

@Component({
	selector: 'app-clipboard',
	templateUrl: './clipboard.component.html',
	styleUrls: ['./clipboard.component.css']
})
export class ClipboardComponent implements OnInit {
	@Input() content
	constructor(public notifyService:NotifyService) { }

	ngOnInit() {
	}

	clipboard(el) {
		let aux = document.createElement('input');
		aux.setAttribute('value', el.innerHTML);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand('copy');
		document.body.removeChild(aux);
		this.notifyService.toast(`Copied ${el.innerHTML}`);
	}
}
