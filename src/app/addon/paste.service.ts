import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';

declare var $:any;

@Injectable()
export class PasteService {

  constructor() { }

  doImport(callback) {
    $('body').on('paste', (e) => {
      let data = (e.originalEvent || e).clipboardData.getData('text/plain');
      this.parseData(data, callback)
    });
  }
  off() {
    $('body').off('paste');
  }
  parseData(data, callback, dialog = true) {
    try {
      let allTextLines = data.split(/\r\n|\n/);
      let separator = ','
      if(allTextLines[0].includes('\t')) {
        separator = '\t'
      }
      let isTitle = allTextLines[1] == '' ? false : true;
      let headers = allTextLines[0].split(separator);
      let skipToData = 1;
      if(!isTitle) {
        let title = allTextLines[0].split(separator);
        headers = allTextLines[2].split(separator);
        skipToData = 3;
      }
      let lines = [];
      for (let i = skipToData; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(separator);
        if(allTextLines[0].includes('","')) {
          data = allTextLines[i].split(`"${separator}"`);
        }
        if (data.length == headers.length) {
          let tarr = {};
          for (let j = 0; j < headers.length; j++) {
            if(data[j] == 'FALSE' || data[j] == 'TRUE') {
              tarr = Object.assign(tarr, {[headers[j]]: eval(data[j].toLowerCase())})
            } else if(!isNaN(data[j])) {
              if(data[j][0] == '0') {
                tarr = Object.assign(tarr, {[headers[j]]: data[j]})
              } else {
                tarr = Object.assign(tarr, {[headers[j]]: eval(data[j])})
              }
            } else {
              tarr = Object.assign(tarr, {[headers[j]]: data[j].replace("\"", "").trim()})
            }
          }
          lines.push(tarr);
        }
      }
      if(lines.length > 0) {
        if(dialog) {
          if(confirm(`Do you want to import ${lines.length} records?`)) {
            callback(lines);
          }
        } else {
          callback(lines);
        }
      }
    } catch(err) {
      console.log(err)
      console.log('Invalid Import');
    }
  }
  exportCSV(data) {
    data = data.filter(el => {
      delete el.pwd;
      delete el.deleted;
      delete el.created_dt;
      delete el.updated_dt;
      return el
    })
    new ngxCsv(data, (new Date()).getFullYear() + (parseInt((new Date()).getMonth().toString()) + 1) + (new Date()).getDate() +  '_' + (new Date()).getHours() + (new Date()).getMinutes() + (new Date()).getSeconds(), {
      // fieldSeparator: '\t',
      headers: Object.keys(data[0])
    })
  }
  importCSV(event, callback, dialog = true) {
    let f = event.addedFiles[0];
    let reader = new FileReader();
    reader.onload = ((file) => {
      return (e) => {
        this.parseData(e.target.result, (data) => {
          callback(data)
        }, dialog)
      };
    })(f);
    reader.readAsText(f);
  }
  download(data, filename = '') {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename ? filename : (new Date()).getFullYear() + (parseInt((new Date()).getMonth().toString()) + 1) + (new Date()).getDate() +  '_' + (new Date()).getHours() + (new Date()).getMinutes() + (new Date()).getSeconds();
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
