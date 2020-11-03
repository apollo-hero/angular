import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-img',
	templateUrl: './img.component.html',
	styleUrls: ['./img.component.css']
})
export class ImgComponent implements OnInit {
	@Input() src
	@Input() alt
	@Input() imgClass
	@Input() height
	@Input() ratio = '16by9'
	isVideo = true;
	constructor() { }

	ngOnInit() {
	}
}
