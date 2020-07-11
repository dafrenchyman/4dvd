import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";

declare var jQuery: any;

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { About4dvdComponent } from "./about4dvd.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { Controller } from "./controller";
import { DatasetTreeComponent } from "./dataset-tree.component";
import { GetJson } from "./getJson";
import { Model } from "./model";
import { ViewComponent } from "./view.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
  // providers: [GetJson]
})
export class AppComponent {
  private _getJson: GetJson;
  title = "4DVD (4-Dimensional Visual Delivery of Big Climate Data)";

  constructor(getJson: GetJson, public dialog: MatDialog) {
    this._getJson = getJson;
  }

  public OpenAboutDialog() {
    const dialogRef = this.dialog.open(About4dvdComponent, {});
    dialogRef.afterClosed().subscribe(() => {});
  }
}
