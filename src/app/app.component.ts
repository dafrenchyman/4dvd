import {Component, Input, ViewChild, ElementRef, OnInit, HostListener} from '@angular/core';

declare var jQuery: any;

import {GetJson} from "./getJson";
import {Model} from "./model";
import {Controller} from "./controller";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //providers: [GetJson]
})
export class AppComponent{

  private _getJson : GetJson;
  title = '4DVD (4-Dimensional Visual Delivery of Big Climate Data) Sam Test 2019-06-26, Third try';

  constructor(getJson : GetJson) {
    this._getJson = getJson;
  }

}
