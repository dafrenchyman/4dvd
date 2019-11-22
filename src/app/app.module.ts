import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Http, HttpModule, JsonpModule} from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { AppComponent } from './app.component';
import { ColorMapMenu } from './color-map-menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatListModule,
  MatSidenavModule,
  MatDialogModule,
  MatTabsModule,
  MatButtonModule,
  MatSliderModule, MatTooltipModule
} from '@angular/material';
import {} from '@angular/material';
import { GetJson } from './getJson';
import {ViewComponent} from './view.component';
import {DatasetMenu} from './dataset-menu';
import {TimeseriesMenu} from './timeseries-menu';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { About4dvdComponent } from './about4dvd/about4dvd.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    ColorMapMenu,
    DatasetMenu,
    TimeseriesMenu,
    About4dvdComponent
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
    MatTooltipModule,
    AppRoutingModule
  ],
  providers: [
    GetJson,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ColorMapMenu, DatasetMenu, TimeseriesMenu]
})
export class AppModule { }
