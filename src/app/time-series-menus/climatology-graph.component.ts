import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { Model } from "../model";
import { TimeseriesData } from "../timeseriesData";
import { ClimatologyData } from "./climatologyData";

@Component({
  selector: "app-time-series-climatology",
  templateUrl: "./climatology-graph.component.html",
  styleUrls: ["./climatology-graph.component.css"]
})

export class ClimatologyGraphComponent {
  private currLevel = 0;
  levels: Array<{
    value: number;
    viewValue: string;
  }>;

  masterMulti: ClimatologyData[] = new Array<any>();
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  timeline = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "";
  showYAxisLabel = true;

  colorScheme = {
    domain: [
      "#e31a1c",
      "#33a02c",
      "#1f78b4",
    ]
  };

  // line, area
  autoScale = true;

  private levelsLoaded = 0;
  private _model: Model;
  private _dialog: MatDialog;
  view: any[];
  multi: TimeseriesData[] = new Array<any>();

  months = [
    "-01",
    "-02",
    "-03",
    "-04",
    "-05",
    "-06",
    "-07",
    "-08",
    "-09",
    "-10",
    "-11",
    "-12"
  ]

  private static getMonthAverage(currTimeseries, month) {
    // returns average of an array with values from a given month
    // intentional duplicate with _______ due to not being able to pass the model reference in _____
    let sum = 0;
    let counter = 0;
    for (let i = 0; i < currTimeseries.length; i++) {
      if (currTimeseries[i].name.includes(month)) {
        sum += currTimeseries[i].value;
        counter++;
      }
    }
    return parseFloat((sum / counter).toFixed(3));
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<ClimatologyGraphComponent>) {
    this._model = data._model;
    this.multi = data.data;
    this.dialogRef = dialogRef;
    this._dialog = dialog;
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
    this.levels = [];

    // create climatology graph
    this.loadLevels();
    this.ChangeLevel();
  }

  private createClimateGraph(selectedLevel) {
    // creates 3 arrays with min, max, and avg values for a given layer for the line graph
    const maxArr = [];
    const minArr = [];
    const avgArr = [];
    let count = 0;
    for (let i = 0; i < this.multi[selectedLevel].series.length; i++) {
      if (maxArr[count] < this.multi[selectedLevel].series[i].value || maxArr[count] == null) {
        maxArr[count] = this.multi[selectedLevel].series[i].value;
      }
      if (minArr[count] >= this.multi[selectedLevel].series[i].value || minArr[count] == null) {
        minArr[count] = this.multi[selectedLevel].series[i].value;
      }

      if (count === 11) {
        count = 0;
      } else {
        count++;
      }
    }

    const currTimeseries = this.multi[selectedLevel].series;
    for (let i = 0; i < 12; i++) {
      avgArr[i] = ClimatologyGraphComponent.getMonthAverage(currTimeseries, this.months[i]);
    }

    this.loadClimateGraph("Historical High", maxArr);
    this.loadClimateGraph("Climatology", avgArr)
    this.loadClimateGraph("Historical Low", minArr);
  }

  private loadClimateGraph(name, valueArr) {
    // creates the line graphs
    const currTimeseries = new ClimatologyData(name, valueArr);
    if (this.levelsLoaded < 3) {
      this.masterMulti.push(currTimeseries);
      this.levelsLoaded++;
    } else {
      if (name === "Historical High") {
        this.masterMulti[0] = currTimeseries;
      } else if (name === "Climatology") {
        this.masterMulti[1] = currTimeseries;
      } else {
        this.masterMulti[2] = currTimeseries;
      }

    }
  }

  private ChangeLevel() {
    // updates the graph
    if (this.levelsLoaded === 0) {
      this.masterMulti = new Array<any>();
      this.createClimateGraph(this.currLevel);
    } else {
      this.masterMulti = [];
      this.createClimateGraph(this.currLevel);
    }

  }

  private loadLevels() {
    // loads and populates the level selection menu
    length = this.multi.length > 5 ? 5 : this.multi.length;
    for (let i = 0; i < length; i++) {
      this.levels.push({
        value: i,
        viewValue: this.multi[i].name
      });
    }
  }

  private yAxisLabel() {
    // returns the correct y axis label
    return `${this._model.settings.GenerateTitle(this._model.settings.FullName)} (${this._model.settings.JustUnits()})`;
  }

  private getToolTipData(jsonString) {
    // get tool tip information for the line chart
    return this._model.settings.getToolTipData(jsonString);
  }

  private getSeriesToolTipData(jsonString) {
    // get tool tip information for the line chart
    return this._model.settings.getSeriesToolTipData(jsonString);
  }

  private DataAvailable() {
    // checks if data has been loaded, mainly so the chart can load without errors
    return this.levelsLoaded === this.masterMulti.length && this.levelsLoaded > 0;
  }

  private getTitle() {
    // returns the title for the dialog
    return `${this._model.settings.GenerateTitle(this._model.settings.FullName)} at ${this.multi[this.currLevel].name} (Lat: ${this._model.settings.GetLatWithDir()}, Lon: ${this._model.settings.GetLonWithDir()})`;
  }

  private closeClimateGraph(menu) {
    // closes the dialog box
    this.dialogRef.close(menu);
  }
}
