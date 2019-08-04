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

  constructor(getJson: GetJson) {
    this._getJson = getJson;
  }

}
