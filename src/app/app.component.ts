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
  title = 'Mr. Sharky Climate Visualizer';

  constructor(getJson : GetJson) {
    this._getJson = getJson;
  }

}
