import { Injectable } from '@angular/core';

declare var cordova:any;
declare var QRCode:any;
declare var QCodeDecoder:any;

@Injectable()
export class QRService {
  constructor() {

  }
  getCode(text) {
    var qrcode = new QRCode();
    qrcode.makeCode(text);
    return qrcode._oDrawing._elCanvas.toDataURL();
  }
  makeCode(text, component, callback) {
    var qrcode = new QRCode();
    qrcode.makeCode(text);
    callback(qrcode._oDrawing._elCanvas.toDataURL(), component);
  }
  decodeFromImage(data, component, callback){
    var qrdecode = QCodeDecoder();
    qrdecode.decodeFromImage(data, function(err, result){
      if (err) callback(err, component);
      callback(result, component);
    });
  }
  decodeFromVideo(data, component, callback){
    var qrdecode = QCodeDecoder();
    qrdecode.decodeFromVideo(data, function(err, result){
      if (err) callback(err, component);
      callback(result, component);
    })
  }
  decodeFromCamera(data, component, callback){
    var qrdecode = QCodeDecoder();
    qrdecode.decodeFromCamera(data, function(err, result){
      if (err) callback(err, component);
      callback(result, component);
    });
  }
  scanCode(component, callback) {
    cordova.plugins.barcodeScanner.scan(function (result) {
      callback(result.text, component);
    }, function (err) {
      callback(err, component);
    }, {
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      resultDisplayDuration: 0,
      prompt : "Place a barcode inside the scan area", // Android
    });
  }
}
