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

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  timeline = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Date";
  showYAxisLabel = true;
  yAxisLabel = "Value";

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
  private dateJson: any;
  private valJson: any;
  private serJson: any;

  public GetLevels() {
    return this._model.settings.Levels;
  }

  public DataAvailable() {
    return this.levelsLoaded === this.multi.length && this.levelsLoaded > 0
      ? true
      : false;
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
  chartToolTipDate(jsonString) {
    console.log(jsonString);
    this.dateJson = jsonString;
    let nameIndex = this.dateJson.indexOf("name");
    nameIndex += 8;
    return this.dateJson.substr(nameIndex, 7);
  }

  chartToolTipVal(jsonString) {
    this.valJson = jsonString;
    let valueIndex = this.valJson.indexOf("value");
    valueIndex += 8;
    return this.valJson.substr(valueIndex, 5);
  }

  closeTimeSeries() {
    this.dialogRef.close();
  }
  yValTitle() {
    if (!this.DataAvailable()) {
      return "Value";
    }
    const yTitle = this._model.settings.GenerateTitle(
      this._model.settings.FullName
    );
    if (yTitle === "Air Temperature") {
      return yTitle.concat(" (\xB0C)");
    } else {
      return yTitle;
    }
  }

  public IsSelected(level): boolean {
    const selected = false;
    for (let counter = 0; counter < this.multi.length; counter++) {
      const currLevelId = this.multi[counter].level_ID;
      const currLevelLoaded = this.multi[counter].loaded;
      if (currLevelId === level.Level_ID) {
        if (currLevelLoaded === true) {
          if (this.multi[counter].visible === true) {
            return true;
          }
        }
      }
    }
    return selected;
  }

  public ToggleTimeseries(level) {
    // If we've already loaded it, don't load it again
    let alreadyLoaded = false;
    for (let counter = 0; counter < this.multi.length; counter++) {
      const currLevelId = this.multi[counter].level_ID;
      const currLevelLoaded = this.multi[counter].loaded;
      if (currLevelId === level.Level_ID) {
        if (currLevelLoaded === true) {
          this.multi[counter].visible =
            this.multi[counter].visible === true ? false : true;
          alreadyLoaded = true;
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

    // Create the header
    csvContent += "Level Name,Date,Value\n";

    if (this.multi.length > 0) {
      for (let counter = 0; counter < this.multi.length; counter++) {
        const currLevelId = this.multi[counter].level_ID;
        const currLevelLoaded = this.multi[counter].loaded;
        const levelName = this.multi[counter].name;
        const currTimeseries = this.multi[counter].series;
        for (let i = 0; i < currTimeseries.length; i++) {
          const dataString =
            levelName +
            "," +
            currTimeseries[i].name +
            "," +
            currTimeseries[i].value;
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
