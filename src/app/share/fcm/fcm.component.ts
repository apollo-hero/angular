import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fcm',
  templateUrl: './fcm.component.html',
  styleUrls: ['./fcm.component.css']
})
export class FcmComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  	this.router.navigate(['main/home']);
  }

}
