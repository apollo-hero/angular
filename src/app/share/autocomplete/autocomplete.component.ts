import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @Input() arr;
  @Input() display;
  @Input() suburb;
  @Input() stateAbbr;
  @Input() value;
  @Output() choose = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onChoose(data) {
    this.choose.emit(data);
    this.arr = null;
  }
}
