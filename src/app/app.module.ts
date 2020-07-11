import { ScrollingModule } from "@angular/cdk/scrolling";
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
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from "@angular/material";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ClickOutsideModule } from "ng-click-outside";
import { NgxPrintModule } from "ngx-print";
import { About4dvdComponent } from "./about4dvd.component";
import { AppComponent } from "./app.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { DatasetMenuComponent } from "./dataset-menu.component";
import { DatasetTreeComponent } from "./dataset-tree.component";
import { GetJson } from "./getJson";
import { TimeseriesMenuComponent } from "./timeseries-menu.component";
import { ViewComponent } from "./view.component";

@NgModule({
  declarations: [
    AppComponent,
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetMenuComponent,
    TimeseriesMenuComponent,
    ViewComponent,
    DatasetTreeComponent
  ],
  imports: [
    BrowserModule,
    ClickOutsideModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    MatSliderModule,
    MatButtonModule,
    MatTooltipModule,
    NgxPrintModule,
    MatTreeModule,
    MatProgressBarModule,
    ScrollingModule,
    MatMenuModule
  ],
  providers: [GetJson, { provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent],
  entryComponents: [
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetMenuComponent,
    TimeseriesMenuComponent,
    DatasetTreeComponent
  ]
})
export class AppModule {}
