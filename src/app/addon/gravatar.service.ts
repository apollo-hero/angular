import { Injectable }    from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class GravatarService {

  constructor() { }

  getLink(email, callback, size = 200) {
    let grEmail = Md5.hashStr(email);
    let url = 'https://secure.gravatar.com/avatar/'+ grEmail + '?s=' + size;
    callback(url);
  }
  getData(email, callback, size = 200) {
    let grEmail = Md5.hashStr(email);
    let url = 'https://secure.gravatar.com/avatar/'+ grEmail + '?s=' + size;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}
