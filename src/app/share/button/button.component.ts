import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
	@Input() classBtn
	@Input() disabled
	@Input() label
	@Input() loading
	@Output() doClick = new EventEmitter();
	constructor() { }

	ngOnInit() {
		setInterval(() => {
			this.disabled = !this.loading;
		}, 1000)
	}

	click(attr) {
		this.disabled = this.loading = true;
		this.doClick.emit(attr)
	}
}
