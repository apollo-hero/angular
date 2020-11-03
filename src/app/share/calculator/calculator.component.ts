import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { evaluate } from 'mathjs'
import * as mathjs from 'mathjs';

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
	@Output() doChange = new EventEmitter();
	screen; operation;
	currentEntry: any = '0'
	constructor() { }

	ngOnInit() {
		let result = 0;
		let prevEntry = 0;
		let operation = null;
		this.updateScreen(result);

		$('.button').on('click', (evt) => {
			let buttonPressed = $(evt.target).html();
			if (buttonPressed === "C") {
				result = 0;
				this.currentEntry = '0';
			} else if (buttonPressed === "CE") {
				this.currentEntry = '0';
			} else if (buttonPressed === "back") {
			} else if (buttonPressed === "+/-") {
				this.currentEntry *= -1;
			} else if (buttonPressed === '.') {
				this.currentEntry += '.';
			} else if (this.isNumber(buttonPressed)) {
				if (this.currentEntry === '0') this.currentEntry = buttonPressed;
				else this.currentEntry = this.currentEntry + buttonPressed;
			} else if (this.isOperator(buttonPressed)) {
				this.operation = buttonPressed;
				this.currentEntry += this.operation;
			} else if(buttonPressed === '%') {
				this.currentEntry = this.currentEntry / 100;
			} else if (buttonPressed === 'sqrt') {
				this.currentEntry = Math.sqrt(this.currentEntry);
			} else if (buttonPressed === '1/x') {
				this.currentEntry = 1 / this.currentEntry;
			} else if (buttonPressed === 'pi') {
				this.currentEntry = Math.PI;
			} else if (buttonPressed === '=') {
				try{
					this.currentEntry = evaluate(this.currentEntry)
				} catch(e){}
				this.operation = null;
			}
			this.updateScreen(this.currentEntry);
		});
	}
	updateScreen = function(displayValue) {
		this.screen = displayValue ? displayValue.toString() : '0'
		this.change(this.screen)
	};
	isNumber = function(value) {
		return !isNaN(value);
	}
	isOperator = function(value) {
		return value === '/' || value === '*' || value === '+' || value === '-';
	};
	operate = function(a, b, operation) {
		a = parseFloat(a);
		b = parseFloat(b);
		if (operation === '+') return a + b;
		if (operation === '-') return a - b;
		if (operation === '*') return a * b;
		if (operation === '/') return a / b;
	}
	change(data) {
		this.doChange.emit(data)
	}
}
