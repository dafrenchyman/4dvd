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
declare let gtag: any; // allows for use of gtag function declared in index.html

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { NavigationEnd, Router } from "@angular/router";
import { About4dvdComponent } from "./about4dvd.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { Controller } from "./controller";
import { GetJson } from "./getJson";
import { Model } from "./model";
import { ViewComponent } from "./view.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private _getJson: GetJson;
  title = "4DVD (4-Dimensional Visual Delivery of Big Climate Data)";

  constructor(
    getJson: GetJson,
    public dialog: MatDialog,
    public router: Router
  ) {
    this._getJson = getJson;

    // Sends a page view to google analytics
    // Angular has a weird issue where there needs to be a route in order to count as a page view
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag("config", "UA-172322528-1", {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

  // ngOnInit() {
  //   const data = sessionStorage.getItem('key');
  //   if (data) {
  //     window.location.href = data;
  //   }
  // }

  public OpenAboutDialog() {
    const dialogRef = this.dialog.open(About4dvdComponent, {
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  saveData() {
    console.log("hello from the other side");
    sessionStorage.setItem('key', window.location.href);

    window.location.href = this.getData();
  }

  getData() {
    console.log('Getting dat data!');
    return sessionStorage.getItem('key');
  }

  removeData() {
    sessionStorage.removeItem('key');
  }
}
