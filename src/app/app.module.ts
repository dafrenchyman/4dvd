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
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { About4dvdComponent } from "./about4dvd.component";
import { AppComponent } from "./app.component";
import { ColorMapMenuComponent } from "./color-map-menu.component";
import { DatasetMenuComponent } from "./dataset-menu.component";
import { GetJson } from "./getJson";
import { TimeseriesMenuComponent } from "./timeseries-menu.component";

@NgModule({
  declarations: [
    AppComponent,
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetMenuComponent,
    TimeseriesMenuComponent
  ],
  imports: [
    BrowserModule,
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
    MatTooltipModule
  ],
  providers: [GetJson, { provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent],
  entryComponents: [
    About4dvdComponent,
    ColorMapMenuComponent,
    DatasetMenuComponent,
    TimeseriesMenuComponent
  ]
})
export class AppModule {}
