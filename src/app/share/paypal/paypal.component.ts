import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'app-paypal',
	templateUrl: './paypal.component.html',
	styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
	@Input() clientId
	@Input() currency
	@Input() total
	@Input() item_name
	@Input() item_qty
	@Input() brand
	@Input() result
	config; success = false;
	constructor() { }

	ngOnInit() {
		this.config = {
			currency: this.currency,
			clientId: this.clientId,
			createOrderOnClient: (data) => {
				return {
					intent: 'CAPTURE',
					purchase_units: [{
						amount: {
							currency_code: this.currency,
							value: this.total,
							breakdown: {
								item_total: {
									currency_code: this.currency,
									value: this.total
								}
							}
						},
						items: [{
							name: this.item_name,
							quantity: this.item_qty,
							category: 'DIGITAL_GOODS',
							unit_amount: {
								currency_code: this.currency,
								value: this.total,
							},
						}]
					}],
					application_context: {
						brand_name: this.brand,
						shipping_preference: 'NO_SHIPPING'
					}
				}
			},
			advanced: {
				commit: 'true'
			},
			style: {
				shape: 'pill',
				color: 'white',
				layout: 'vertical',
				label: 'pay'
			},
			onApprove: (data, actions) => {
				actions.order.get().then(details => {
					if (details.status === 'APPROVED') {
						this.success = true
						this.result['passphrase'] = details.id
						this.result['order_status'] = 'approved'
					}
				});
			},
			onClientAuthorization: (data) => {
				if (data.status === 'COMPLETED') {
					this.success = true
					this.result['passphrase'] = data.id;
					this.result['order_status'] = 'await';
				}
			},
			onCancel: (data, actions) => {
				console.log(data, actions)
			},
			onError: err => {
				console.log(err)
			},
			onClick: (data, actions) => {
                this.success = false
            }
		}
	}

}
