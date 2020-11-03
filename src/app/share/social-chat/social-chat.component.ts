import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-social-chat',
	templateUrl: './social-chat.component.html',
	styleUrls: ['./social-chat.component.css']
})
export class SocialChatComponent implements OnInit {
	@Input() ratio = '16by9'
	@Input() social = 'zalo'
	@Input() uid
	link;
	constructor(private deviceService: DeviceDetectorService) {}

	ngOnInit() {
		if(this.social == 'zalo' && this.uid) {
			if(this.deviceService.isMobile() || this.deviceService.isTablet()) {
				this.link = `https://zalo.me/${this.uid.replace(/ /g, '')}`
			} else {
				this.link = `https://chat.zalo.me/?phone=${this.uid.replace(/ /g, '')}`
			}
		}
	}
}
