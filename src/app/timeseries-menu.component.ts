import { Component, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

import { MatDialogRef } from "@angular/material/dialog";
import { Helpers } from "./helpers";
import { Model } from "./model";
import { Settings } from "./settings";
import { TimeseriesData } from "./timeseriesData";
/**
 * Created by dafre on 5/14/2017.
 */

declare var jQuery: any;
declare var c3: any;

@Component({
  templateUrl: "./timeseries-menu.component.html",
  styleUrls: ["./timeseries-menu.component.css"]
})
export class TimeseriesMenuComponent {
  public TimeSeriesChart: any;
  public FinalTimeSeriesData: any;

  multi: TimeseriesData[] = new Array<any>();
  view: any[];
  levelsLoaded = 0;
  toolTipData: Array<{
    date: string;
    value: string;
    layer: string;
  }>;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  timeline = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Time";
  showYAxisLabel = true;

  colorScheme = {
    domain: [
      "#1f78b4",
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
      "#b15928"
    ]
  };

  // line, area
  autoScale = true;

  private _model: Model;

  // returns the index of the lone level that is currently selected
  private lonerLevelCheck(): number {
    if (this.levelsLoaded <= 1 && this.DataAvailable()) {
      return this.multi[0].level_ID - 1;
    }
    return -1;
  }

  public GetLevels() {
    return this._model.settings.Levels;
  }

  private getLat() {
    if (String(this._model.settings.CurrGridBoxLat).length > 7) {
      return this._model.settings.CurrGridBoxLat.toFixed(2);
    } else {
      return this._model.settings.CurrGridBoxLat;
    }
  }

  private getLon() {
    if (String(this._model.settings.CurrGridBoxLon).length > 7) {
      return this._model.settings.CurrGridBoxLon.toFixed(2);
    } else {
      return this._model.settings.CurrGridBoxLon;
    }
  }

  public DataAvailable() {
    return this.levelsLoaded === this.multi.length && this.levelsLoaded > 0;
  }

  public constructor(
    private dialogRef: MatDialogRef<TimeseriesMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._model = data;
    this.levelsLoaded = 1;
    this.multi = new Array<any>();
    this.view = [
      Math.floor(
        this._model.settings.viewportWidth -
          this._model.settings.viewportWidth * 0.25
      ),
      Math.floor(
        this._model.settings.viewportHeight -
          this._model.settings.viewportHeight * 0.32
      )
    ];
    for (
      let counter = 0;
      counter < this._model.settings.Levels.length;
      counter++
    ) {
      const currLevel = this._model.settings.Levels[counter];
      if (currLevel.Level_ID === this._model.settings.Level_ID) {
        this.loadTimeseries(
          this._model.settings.Dataset,
          this._model.settings.CurrGridBoxId,
          currLevel.Level_ID,
          currLevel.Name
        );
      }
    }
  }

  getSeriesToolTipData(jsonString) {
    // Get graph tool tip data for multiple levels
    this.toolTipData = [];
    const jsonArr = JSON.parse(jsonString);
    for (let i = 0; i < jsonArr.length; i++) {
      this.toolTipData.push({
        date: jsonArr[i].name, // date
        value: jsonArr[i].value.toFixed(4), // value
        layer: jsonArr[i].series // layer
      });
    }
    return this.toolTipData;
  }

  getToolTipData(jsonString) {
    // Get graph tool tip data for a single level
    this.toolTipData = [];
    const jsonArr = JSON.parse(jsonString);
    this.toolTipData.push({
      date: jsonArr.name, // date
      value: jsonArr.value.toFixed(4), // value
      layer: jsonArr.series // layer
    });
    return this.toolTipData;
  }

  getTTDate(jsonString) {
    return JSON.parse(jsonString)[0].name; // return just date
  }

  closeTimeSeries() {
    this.dialogRef.close();
  }

  yValTitle() {
    if (!this.DataAvailable()) {
      return "Value";
    }
    const yTitle = this._model.settings.GenerateSimpleTitle(
      this._model.settings.FullName
    );
    if (yTitle.search("Temperature") >= 0) {
      return yTitle.concat(" (\xB0C)");
    } else if (
      yTitle === "Volumetric Soil Moisture" ||
      yTitle === "ice thickness"
    ) {
      return yTitle;
    } else {
      return yTitle + " (" + this._model.settings.DataUnits + ")";
    }
  }

  public ToggleTimeseries(level) {
    // If we've already loaded it, don't load it again
    let alreadyLoaded = false;
    for (let counter = 0; counter < this.multi.length; counter++) {
      const currLevelId = this.multi[counter].level_ID;
      const currLevelLoaded = this.multi[counter].loaded;
      if (currLevelId === level.Level_ID) {
        if (currLevelLoaded === true) {
          // If the level has already been loaded, we remove the selected pressure layer and update the graph here
          this.multi[counter].visible = this.multi[counter].visible !== true;
          const removeLevel = this.multi.indexOf(this.multi[counter]);
          this.multi.splice(removeLevel, 1);
          this.multi = [...this.multi];
          alreadyLoaded = true;
          this.levelsLoaded--;
        }
      }
    }

    if (!alreadyLoaded) {
      for (
        let counter = 0;
        counter < this._model.settings.Levels.length;
        counter++
      ) {
        if (level.Level_ID === this._model.settings.Levels[counter].Level_ID) {
          this.levelsLoaded++;
          this.loadTimeseries(
            this._model.settings.Dataset,
            this._model.settings.CurrGridBoxId,
            level.Level_ID,
            level.Name
          );
        }
      }
    }
  }

  private loadTimeseries(dataset, gridBoxId, level_id, levelName) {
    this._model.loadTimeseries(dataset, gridBoxId, level_id).then(result => {
      const rawData: any = result;
      rawData.ValueFinal = [];
      rawData.ValueFinal = Helpers.ProcessRawDataValue(
        rawData.Value,
        this._model.settings
      );
      const currTimeseries = new TimeseriesData(levelName, level_id, rawData);
      this.multi.push(currTimeseries);
    });
  }

  createCsvFromTimeseriesData() {
    let csvContent = "data:text/csv;charset=utf-8,";
    const valueTitle = this._model.settings.GenerateSimpleTitle(
      this._model.settings.FullName
    );
    let dataUnits;
    valueTitle === "Air Temperature" || valueTitle === "Soil Temperature" // Air Temp DataUnits are degK, Soil Temp does not have a DataUnits value
      ? (dataUnits = "degC")
      : (dataUnits = this._model.settings.DataUnits);

    // Create the header
    if (this._model.settings.LevelName === "Default") {
      // if dataset is single level
      csvContent += `Date,${valueTitle} [${dataUnits}],Latitude,Longitude,Level\n`;
    } else {
      const level_name = this._model.settings.LevelName.split(" ")[1];
      csvContent += `Date,${valueTitle} [${dataUnits}],Latitude,Longitude,Level [${level_name}]\n`;
    }

    if (this.multi.length > 0) {
      for (let counter = 0; counter < this.multi.length; counter++) {
        const currLevelId = this.multi[counter].level_ID;
        const currLevelLoaded = this.multi[counter].loaded;
        let levelName = this.multi[counter].name.split(" ")[0]; // Remove "millibar" in level name
        if (levelName === "Default") {
          levelName = "Single Level";
        } // default = single level dataset
        const currTimeseries = this.multi[counter].series;
        let dataString;
        for (let i = 0; i < currTimeseries.length; i++) {
          dataString = `${currTimeseries[i].name},${currTimeseries[
            i
          ].value.toFixed(3)},${this.getLat()},${this.getLon()},${levelName}`;
          csvContent += dataString + "\n";
        }
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        this._model.settings.Dataset.DatabaseStore.substr(
          9,
          this._model.settings.Dataset.DatabaseStore.length
        ) +
          "_Timeseries_Lat" +
          this._model.settings.CurrGridBoxLat +
          "_Lon" +
          this._model.settings.CurrGridBoxLon +
          ".csv"
      );
      link.click();
    }
  }
}
