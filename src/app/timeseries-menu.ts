import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Settings} from "./settings";
import {Helpers} from "./helpers";
import {Model} from "app/model";
import {TimeseriesData} from "./timeseriesData";
/**
 * Created by dafre on 5/14/2017.
 */

declare var jQuery: any;
declare var c3: any;

@Component({
  templateUrl: './timeseries-menu.html',
  styleUrls: ['./timeseries-menu.css']
})

export class TimeseriesMenu {

  public  TimeSeriesChart : any;
  public  FinalTimeSeriesData : any;

  multi: TimeseriesData[] = new Array<any>();
  view: any[];
  levelsLoaded: number = 0;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  timeline = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Value';

  colorScheme = {
    domain: ["#1f78b4",
      "#a6cee3",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928]"]
  };

  // line, area
  autoScale = true;

  public GetLevels() {
    return this._model.settings.Levels;
  }
  private _model: Model;

  public DataAvailable() {
    return this.levelsLoaded == this.multi.length && this.levelsLoaded > 0 ? true : false;
  }

  public constructor (
    private dialogRef: MatDialogRef<TimeseriesMenu>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this._model = data;
    this.levelsLoaded = 1;
    this.multi = new Array<any>();
    this.view = [Math.floor(this._model.settings.viewportWidth - this._model.settings.viewportWidth*0.25),
      Math.floor(this._model.settings.viewportHeight - this._model.settings.viewportHeight*0.32)];
    for (var counter = 0; counter < this._model.settings.Levels.length; counter++) {
      var currLevel = this._model.settings.Levels[counter];
      if (currLevel.Level_ID == this._model.settings.Level_ID) {
        this.loadTimeseries(this._model.settings.Dataset, this._model.settings.CurrGridBoxId, currLevel.Level_ID, currLevel.Name);
      }
    }
  }
  closeTimeSeries() {
    this.dialogRef.close();
  }
  yValTitle(): String {
    if (!this.DataAvailable()) {
      return 'Value';
    }
    let r: any[];
    r = this._model.settings.FullName.split('|');
    if (r.length < 5) {
      return 'Precipitation';
    }
    if (r[r.length - 2] === 'Air Temperature') {
      return r[r.length - 2].concat(' (\xB0C)');
    }
    return r[r.length - 2];
  }

  public IsSelected(level) : boolean {
    var selected = false;
    for (var counter = 0; counter < this.multi.length; counter++) {
      var currLevelId = this.multi[counter].level_ID;
      var currLevelLoaded = this.multi[counter].loaded;
      if (currLevelId == level.Level_ID) {
        if (currLevelLoaded == true) {
          if (this.multi[counter].visible == true) {
            return true;
          }
        }
      }
    }
    return selected;
  }

  public ToggleTimeseries(level) {
    // If we've already loaded it, don't load it again
    var alreadyLoaded = false;
    for (var counter = 0; counter < this.multi.length; counter++) {
      var currLevelId = this.multi[counter].level_ID;
      var currLevelLoaded = this.multi[counter].loaded;
      if (currLevelId == level.Level_ID) {
        if (currLevelLoaded == true) {
          if (this.multi[counter].visible == true) {
            this.multi[counter].visible = false;
          } else {
            this.multi[counter].visible = true;
          }
          alreadyLoaded = true;
        }
      }
    }

    if (!alreadyLoaded) {
      for (var counter = 0; counter < this._model.settings.Levels.length; counter++) {
        if (level.Level_ID == this._model.settings.Levels[counter].Level_ID) {
          this.levelsLoaded++;
          this.loadTimeseries(this._model.settings.Dataset, this._model.settings.CurrGridBoxId, level.Level_ID, level.Name);
        }
      }
    }
  }

  private loadTimeseries(dataset, gridBoxId, level_id, levelName) {
    this._model.loadTimeseries(dataset, gridBoxId, level_id).then(
      result => {
        var rawData :any = result;
        rawData.ValueFinal = [];
        rawData.ValueFinal = Helpers.ProcessRawDataValue(rawData.Value, this._model.settings);
        var currTimeseries = new TimeseriesData(levelName, level_id, rawData);
        this.multi.push(currTimeseries);
      }
    );
  }

  createCsvFromTimeseriesData() {
    var csvContent = "data:text/csv;charset=utf-8,";

    // Create the header
    csvContent += "Level Name,Date,Value\n";

    if (this.multi.length > 0) {
      for (var counter = 0; counter < this.multi.length; counter++) {
        var currLevelId = this.multi[counter].level_ID;
        var currLevelLoaded = this.multi[counter].loaded;
        var levelName = this.multi[counter].name;
        var currTimeseries = this.multi[counter].series;
        for (var i = 0; i < currTimeseries.length; i++) {
          var dataString = levelName + "," + currTimeseries[i].name + "," + currTimeseries[i].value;
          csvContent += dataString + "\n";
        }
      }

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", this._model.settings.Dataset.DatabaseStore +
        "_Timeseries_Lat" + this._model.settings.CurrGridBoxLat +
        "_Lon" + this._model.settings.CurrGridBoxLon + ".csv");
      link.click();
    }
  }
}
