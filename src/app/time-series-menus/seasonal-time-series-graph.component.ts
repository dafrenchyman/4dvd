import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { Model } from "../model";
import { TimeseriesData } from "../timeseriesData";
import { SeasonalTimeSeriesData } from "./seasonalTimeSeriesData";

@Component({
  selector: "app-time-series-seasonal-graph2",
  templateUrl: "./seasonal-time-series-graph.component.html",
  styleUrls: ["./seasonal-time-series-graph.component.css"]
})

export class SeasonalTimeSeriesGraphComponent {
  private newMulti: SeasonalTimeSeriesData[] = new Array<any>();
  private levelsLoaded = 0;
  private monthPicked = 0;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  timeline = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Year";
  showYAxisLabel = true;
  tickArray = [];

  colorScheme = {
    domain: [
      "#1f78b4",
      "#33a02c",
      "#6a3d9a",
      "#e31a1c",
      "#ff7f00",
      "#a6cee3",
      "#b2df8a",
      "#cab2d6",
      "#fb9a99",
      "#fdbf6f",
      "#ffff99",
      "#b15928"
    ]
  };

  // line, area
  autoScale = true;

  months = [
    { value: ["-01"], viewValue: "January", viewNum: 0 },
    { value: ["-02"], viewValue: "February", viewNum: 1 },
    { value: ["-03"], viewValue: "March", viewNum: 2 },
    { value: ["-04"], viewValue: "April", viewNum: 3 },
    { value: ["-05"], viewValue: "May", viewNum: 4 },
    { value: ["-06"], viewValue: "June", viewNum: 5 },
    { value: ["-07"], viewValue: "July", viewNum: 6 },
    { value: ["-08"], viewValue: "August", viewNum: 7 },
    { value: ["-09"], viewValue: "September", viewNum: 8 },
    { value: ["-10"], viewValue: "October", viewNum: 9 },
    { value: ["-11"], viewValue: "November", viewNum: 10 },
    { value: ["-12"], viewValue: "December", viewNum: 11 },
    { value: ["-12", "-01", "-02"], viewValue: "Dec, Jan, Feb", viewNum: 12 },
    { value: ["-03", "-04", "-05"], viewValue: "Mar, Apr, May", viewNum: 13 },
    { value: ["-06", "-07", "-08"], viewValue: "Jun, Jul, Aug", viewNum: 14 },
    { value: ["-09", "-10", "-11"], viewValue: "Sept, Oct, Nov", viewNum: 15 }
  ];

  private _model: Model;
  private _dialog: MatDialog;
  view: any[];
  multi: TimeseriesData[] = new Array<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<SeasonalTimeSeriesGraphComponent>) {
    this._model = data._model;
    this.multi = data.data;
    this.dialogRef = dialogRef;
    this._dialog = dialog;
    this.newMulti = [];
    this.view = [
      Math.floor(
        this._model.settings.viewportWidth -
        this._model.settings.viewportWidth * 0.25
      ),
      Math.floor(
        this._model.settings.viewportHeight -
        this._model.settings.viewportHeight * 0.32
      )
    ]

    this.loadChart(this.monthPicked);
  }

  private loadChart(currMon) {
    // loads the chart with up to 5 different pressure layers of data
    this.levelsLoaded = 0;
    this.newMulti = [];

    length = this.multi.length > 5 ? 5 : this.multi.length;
    for (let i = 0; i < length; i++) {
      const currTimeseries = new SeasonalTimeSeriesData(this.multi[i].name, this.getMonthArr(currMon, i), currMon);
      this.newMulti.push(currTimeseries);
      this.levelsLoaded++;
    }
    this.tickArray = this.getXAxisTicks();
  }

  getMonthArr(month, index) {
    // creates and populates an array with the filtered dates based on the month and their values
    const monthValArr = new Array<{
      name: string;
      value: number;
    }>();
    const currTimeseries = this.multi[index].series;
    const monthValue = this.months[month].value;
    if (month < 12) {
      for (let i = 0; i < currTimeseries.length; i++) {
        const timeSeriesName = currTimeseries[i].name;
        if (timeSeriesName.includes(monthValue[0])) {
          monthValArr.push(currTimeseries[i]);
        }
      }
    } else {
      for (let i = 0; i < currTimeseries.length; i++) {
        const tSName = currTimeseries[i].name;
        if (tSName.includes(monthValue[0]) || tSName.includes(monthValue[1]) || tSName.includes(monthValue[2])) {
          monthValArr.push(currTimeseries[i]);
          }
        }
      }

    return monthValArr;
  }

  private yAxisLabel() {
    // gets the y axis label
    return `${this._model.settings.GenerateSimpleTitle(this._model.settings.FullName)} (${this._model.settings.JustUnits()})`;
  }

  private DataAvailable() {
    // checks if the data has been loaded
    return this.levelsLoaded === this.newMulti.length && this.levelsLoaded > 0;
  }

  private changeMonth() {
    // updates the graph for a different month
    this.loadChart(this.monthPicked);
  }

  private closeSeasonalTSGraph(menu) {
    // closes the dialog box
    this.dialogRef.close(menu);
  }

  private getTitle() {
    // gets the title for the dialog box
    if (this._model != null) {
      if (this._model.settings != null) {
        return `${this.months[this.monthPicked].viewValue} ${this._model.settings.GenerateTitle(this._model.settings.FullName)} (Lat: ${this._model.settings.GetLatWithDir()}, Lon: ${this._model.settings.GetLonWithDir()})`;
      }
    }
    return "Seasonal Time Series";
  }

  private getToolTipData(jsonString) {
    // gets tool tip info
    return this._model.settings.getToolTipData(jsonString);
  }

  private getSeriesToolTipData(jsonString) {
    // gets tool tip info
    return this._model.settings.getSeriesToolTipData(jsonString);
  }

  private getTTYear(jsonString) {
    // gets tool tip info
    return JSON.parse(jsonString)[0].name;
  }

  private getTTTitle() {
    // gets the tool tip title
    return `${this._model.settings.GenerateSimpleTitle(this._model.settings.FullName)} (${this._model.settings.JustUnits()})`;
  }

  private isYearOrDate() {
    // checks if we should refer to the time value as a date or a year
    if (this.monthPicked < 12) {
      return 'Year';
    }
    return 'Date';
  }

  private getXAxisTicks() {
    // manually spaces out the x axis ticks
    const currTimeSeries = this.newMulti[0].series
    const length = currTimeSeries.length;
    const tickGap = Math.round(length / 40); // This will create 40 ticks on the X axis
    const tickArray = [];
    for (let i = 0; i < length; i++) {
      if (i % tickGap === 0) {
        tickArray.push(currTimeSeries[i].name);
      }
    }
    return tickArray;
  }

  private getDateRange() {
    // gets the date range of the current dataset
    const currTimeSeries = this.newMulti[0].series;
    const maxIndex = currTimeSeries.length - 1;
    return `${this.isYearOrDate()} Range: ${currTimeSeries[0].name} to ${currTimeSeries[maxIndex].name}`
  }

}
