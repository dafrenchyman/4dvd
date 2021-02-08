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
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ClickOutsideModule } from "ng-click-outside";
import { Ng5SliderModule } from "ng5-slider";
import { NgxPrintModule } from "ngx-print";
import { About4dvdComponent } from "./about4dvd.component";
import { AppComponent } from "./app.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { DatasetTreeComponent } from "./dataset-tree.component";
import { GetJson } from "./getJson";
import { TimeSeriesStatisticsComponent } from "./time-series-statistics.component";
import { TimeseriesMenuComponent } from "./timeseries-menu.component";
import { ViewComponent } from "./view.component";
import { LinearTrendComponent } from "./linear-trend.component";
@NgModule({
  declarations: [
    About4dvdComponent,
    AppComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent,
    ViewComponent,
    TimeSeriesStatisticsComponent,
    LinearTrendComponent
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
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    Ng5SliderModule,
    NgxChartsModule,
    NgxPrintModule,
    MatMenuModule,
    MatTableModule,
    MatTreeModule,
    NgxChartsModule,
    NgxPrintModule
  ],
  providers: [GetJson, { provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent],
  entryComponents: [
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent,
    TimeSeriesStatisticsComponent,
    LinearTrendComponent
  ]
})
export class AppModule {}
