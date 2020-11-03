import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
	@Input() defaultView
	@Input() header
	@Input() locale
	@Input() businessHours
	@Input() events
	@Output() dateClick = new EventEmitter();
	calendarPlugins = [dayGridPlugin,timeGridPlugin,interactionPlugin]
	locales = [viLocale]
	constructor() { }

	ngOnInit() {
		if(this.header) {
			this.header = this.header ? JSON.parse(this.header.replace(/'/g,'"')) : {}
		}
	}
	handleDateClick(data) {
		this.dateClick.emit(data)
	}
}
