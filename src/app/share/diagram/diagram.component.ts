import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

const shortid = require('shortid')
declare var mermaid:any;

@Component({
	selector: 'app-diagram',
	templateUrl: './diagram.component.html',
	styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {
	@Input() classGroup
	@Input() name
	@Input() label
	@Input() data
	@Output() doChange = new EventEmitter();
	interval;
	id = shortid()
	constructor() { 
		mermaid.initialize({startOnLoad:true, securityLevel: 'loose'});
	}

	ngOnInit() {
	}
	ngAfterViewInit() {
		if(this.data[this.name]) {
			mermaid.init();
		} else {
			this.interval = setInterval(() => {
				mermaid.init();
			}, 500)
		}
	}
	ngOnDestroy() {
		clearInterval(this.interval)
	}

	change(data) {
		clearInterval(this.interval)
		mermaid.init();
		try {
			mermaid.render(`mermaid-${this.id}`, data, (svg) => {
				document.querySelector(`#${this.id}`).innerHTML = svg;
			});
		} catch(e){}
		this.doChange.emit(data)
	}
	compile() {
		let temp = this.data[this.name]
		this.data[this.name] = null;
		setTimeout(() => {
			this.data[this.name] = temp;
			this.interval = setInterval(() => {
				mermaid.init();
			}, 500)
		}, 500)
	}
}
