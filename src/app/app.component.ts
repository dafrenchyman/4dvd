import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";

declare var jQuery: any;

import { Controller } from "./controller";
import { GetJson } from "./getJson";
import { Model } from "./model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
  // providers: [GetJson]
})
// tslint:disable:one-line
export class AppComponent {
  private _getJson: GetJson;
  title = "4DVD (4-Dimensional Visual Delivery of Big Climate Data)";

  constructor(getJson: GetJson) {
    this._getJson = getJson;
  }
}
