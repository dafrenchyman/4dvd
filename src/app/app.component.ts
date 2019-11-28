import {Component, Input, ViewChild, ElementRef, OnInit, HostListener} from '@angular/core';

declare var jQuery: any;

import {GetJson} from './getJson';
import {Model} from './model';
import {Controller} from './controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // providers: [GetJson]
})
// tslint:disable:one-line
export class AppComponent{
  private _getJson: GetJson;
  title = '4DVD (4-Dimensional Visual Delivery of Big Climate Data)';
  logo = getLogoLocation();

  constructor(getJson: GetJson) {
    this._getJson = getJson;
  }

}

function getLogoLocation() {
  if (UrlExists('../assets/4DVDLogoV1.png')){
    return '../assets/4DVDLogoV1.png'
  } else if (UrlExists('/beta/LogoAndTimeSeries/assets/4DVDLogoV1.png')){
    return '/beta/LogoAndTimeSeries/assets/4DVDLogoV1.png'
  } else {
    return '../assets/4DVDLogoV1.png';
  }
}

function UrlExists(url)
{
  const http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status !== 404;
}
