import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule, JsonpModule } from "@angular/http";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatTooltipModule
} from "@angular/material";
import { MatMenuModule } from "@angular/material/menu";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ClickOutsideModule } from "ng-click-outside";
import { NgxPrintModule } from "ngx-print";
import { About4dvdComponent } from "./about4dvd.component";
import { AppComponent } from "./app.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { DatasetTreeComponent } from "./dataset-tree.component";
import { GetJson } from "./getJson";
import { TimeseriesMenuComponent } from "./timeseries-menu.component";
import { ViewComponent } from "./view.component";

@NgModule({
  declarations: [
    About4dvdComponent,
    AppComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent,
    ViewComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ClickOutsideModule,
    FormsModule,
    HttpModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    NgxChartsModule,
    NgxPrintModule,
    MatMenuModule,
  ],
  providers: [GetJson, { provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent],
  entryComponents: [
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent
  ]
})
export class AppModule {}
