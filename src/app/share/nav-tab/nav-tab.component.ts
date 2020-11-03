import { Component, OnInit, Input} from '@angular/core';

@Component({
	selector: 'app-nav-tab',
	templateUrl: './nav-tab.component.html',
	styleUrls: ['./nav-tab.component.css']
})
export class NavTabComponent implements OnInit {
	@Input() steps;
	@Input() routers;
	@Input() labels;
	@Input() classNav;
	@Input() active=0;
	constructor() {}

	ngOnInit() {
		this.steps = [...Array(this.steps).keys()]
	}

}
