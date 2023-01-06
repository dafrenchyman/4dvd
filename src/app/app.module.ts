import { DragDropModule } from "@angular/cdk/drag-drop";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
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
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ClickOutsideModule } from "ng-click-outside";
import { Ng5SliderModule } from "ng5-slider";
import { NgxPrintModule } from "ngx-print";
import { About4dvdComponent } from "./about4dvd.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { DatasetTreeComponent } from "./dataset-tree.component";
import { GetJson } from "./getJson";
import { GoogleAnalyticsComponent } from "./google-analytics.component";
import { HistogramComponent } from "./histogram.component";
import { LinearTrendComponent } from "./linear-trend.component";
import { ClimatologyGraphComponent } from "./time-series-menus/climatology-graph.component";
import { SeasonalChartComponent } from "./time-series-menus/seasonal-chart.component";
import { SeasonalTimeSeriesGraphComponent } from "./time-series-menus/seasonal-time-series-graph.component";
import { TimeSeriesStatisticsComponent } from "./time-series-statistics.component";
import { TimeseriesMenuComponent } from "./timeseries-menu.component";
import { TutorialMenuComponent } from "./tutorial-menu/tutorial-menu.component";
import { ViewComponent } from "./view.component";
@NgModule({
  declarations: [
    About4dvdComponent,
    AppComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent,
    ViewComponent,
    TimeSeriesStatisticsComponent,
    LinearTrendComponent,
    GoogleAnalyticsComponent,
    SeasonalChartComponent,
    ClimatologyGraphComponent,
    SeasonalTimeSeriesGraphComponent,
    HistogramComponent,
    TutorialMenuComponent
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
    NgxPrintModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatStepperModule,
    MatGridListModule,
    DragDropModule
  ],
  providers: [
    GetJson,
    { provide: APP_BASE_HREF, useValue: "/" },
    GoogleAnalyticsComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetTreeComponent,
    TimeseriesMenuComponent,
    TimeSeriesStatisticsComponent,
    LinearTrendComponent,
    GoogleAnalyticsComponent,
    SeasonalChartComponent,
    ClimatologyGraphComponent,
    SeasonalTimeSeriesGraphComponent,
    HistogramComponent,
    TutorialMenuComponent
  ]
})
export class AppModule {}
