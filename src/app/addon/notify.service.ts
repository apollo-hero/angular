import { Injectable } from '@angular/core';

import * as $ from 'jquery'
import 'bootstrap/js/dist/toast';

@Injectable()
export class NotifyService {

  constructor() {
    $('body').prepend('<div id="toast" class="fixed-top" style="z-index:1060"></div>')
  }

  toast(title, content = '', type = 'info', delay = 3000) {
    let notify = `
    <div class="toast mx-auto my-1" data-autohide="true" data-animation="true" data-delay="${delay}">
    <div class="p-1 text-white bg-${type} text-center" data-dismiss="toast">
    <strong class="text-capitalize">${title}</strong>
    </div>
    <div class="toast-body ${content.length==0?'d-none':'d-block'} text-capitalize">${content}</div>
    </div>
    `
    $('#toast').append(notify)
    let toast: any = $('.toast')
    $('#toast').on('click', function(el) {
      toast.toast('hide');
    })
    toast.toast('show');
    $('.toast').on('hidden.bs.toast', function(el) {
      $(el.target).remove()
    })
  }
}
