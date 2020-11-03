import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-reroute',
	templateUrl: './reroute.component.html',
	styleUrls: ['./reroute.component.css']
})
export class RerouteComponent implements OnInit {

	constructor(private activatedroute: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		let mod = this.activatedroute.snapshot.params['mod'];
		let nav = this.activatedroute.snapshot.params['nav'];
		let param = this.activatedroute.snapshot.params['param'];
		if(mod && nav && param) {
			this.router.navigate([`${mod}/${nav}`, param]);
		}
	}

}
