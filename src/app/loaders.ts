/**
 * Created by dafre on 5/14/2017.
 */

import { Dataset } from "./Dataset";
import { GetJson } from "./getJson";
import { Helpers } from "./helpers";
import { Settings } from "./settings";

declare var jQuery: any;
declare var URI: any;

export class Loaders {
  MenuItems: any;
  MenuData: any[];

  private _settings: Settings;
  private _getJson: GetJson;
  private _levels: any;
  private _serverString: string;
  private _rawData: any;
  private _rawTimeseriesData: any;

  public constructor(getJson: GetJson, settings: Settings) {
    this._settings = settings;
    this._getJson = getJson;
    this._serverString = settings.ServerString;

    this.MenuData = [];
    this.MenuItems = {};

    // Begin
    this.LoadDatasets();
  }

  public LoadDatasets() {
    // Load with Angular2
    const datasetLoader = this._getJson.getAll(
      this._serverString + "assets/g_datasets.php"
    );
    datasetLoader.then(result => {
      const results: any = result;
      let currId = 0;
      const MenuDataFull: Dataset[] = [];
      // this.MenuItems.id = 0;
      for (let counter = 0; counter < results.Name.length; counter++) {
        const datasetStructure = results.Name[counter].split("|");
        const currStructure = datasetStructure;
        let currMenu = this.MenuItems;
        let parentId = 0;
        for (
          let structCounter = 0;
          structCounter < currStructure.length;
          structCounter++
        ) {
          const currProperty = currStructure[structCounter];
          if (!currMenu.hasOwnProperty(currProperty)) {
            currMenu[currProperty] = {};
            currMenu[currProperty].id = ++currId;
            currMenu[currProperty].parentId = parentId;
            if (structCounter === currStructure.length - 1) {
              MenuDataFull.push(
                new Dataset({
                  Name: currProperty,
                  FullName: results.Name[counter],
                  Dataset_ID: results.Dataset_ID[counter],
                  DatabaseStore: results.DatabaseStore[counter],
                  OriginalLocation: results.OriginalLocation[counter],
                  StartDate: results.StartDate[counter],
                  EndDate: results.EndDate[counter],
                  Units: results.Units[counter],
                  DefaultLevel: results.DefaultLevel[counter]
                })
              );

              this.MenuData.push({
                id: currId,
                parentId,
                name: currProperty,
                FullName: results.Name[counter],
                Dataset_ID: results.Dataset_ID[counter],
                DatabaseStore: results.DatabaseStore[counter],
                OriginalLocation: results.OriginalLocation[counter],
                StartDate: results.StartDate[counter],
                EndDate: results.EndDate[counter],
                Units: results.Units[counter],
                DefaultLevel: results.DefaultLevel[counter]
              });
            } else {
              this.MenuData.push({
                id: currId,
                parentId,
                name: currProperty
              });
            }
          }
          parentId = currMenu[currProperty].id;
          currMenu = currMenu[currProperty];
        }
      }
      this._settings.Datasets = MenuDataFull;
    });

    /*var scriptToLoad = jQuery.Deferred();
    scriptToLoad.resolve();
    scriptToLoad = jQuery.getScript("./php/g_datasets.php");

    jQuery.when(scriptToLoad).done(function () {
      // Organize the structure into something "nice" so we can load it properly

    });
    return scriptToLoad;*/
  }

  public LoadLevelData(): any {
    const filename =
      this._serverString +
      "assets/g_GetLevel.php" +
      "?dbname=" +
      this._settings.DatabaseStore;
    const datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then(result => {
      this._levels = result;

      // Layer Selection buttons
      jQuery("#Levels").empty();
      for (let i = 0; i < this._levels.Name.length; i++) {
        let checked = "";
        if (i === 0) {
          checked = 'checked="checked"';
        }
        const level_id = this._levels.Level_ID[i];
        const name = this._levels.Name[i];

        // Layers
        const radioBtn = jQuery(
          '<input type="radio" id="levelRadio' +
            parseInt(level_id, 10) +
            '" onchange="UI.changeLevel(this.value, function(){UI.LoadSphereData();})" value="' +
            level_id +
            '" name="levelRadio" ' +
            checked +
            '><label for="levelRadio' +
            level_id +
            '">' +
            name +
            "</label>"
        );
        radioBtn.appendTo("#Levels");
      }
      // $("#Levels").buttonset();
      /*if (!(callbackFunc === undefined)) {
        callbackFunc();
      }*/
    });

    /*var scriptToLoad = jQuery.getScript(filename);
    jQuery.when(scriptToLoad).done(function () {

    });
    return scriptToLoad;*/
    return this._levels;
  }

  public LoadSphereDataMenu(callbackFunc) {
    const filename =
      this._serverString +
      "assets/g_GetGridData.php" +
      "?dbname=" +
      this._settings.DatabaseStore +
      "&date=" +
      this._settings.CurrDate +
      "&level=" +
      this._settings.Level_ID;
    const datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then(result => {
      this._rawData = result;
      if (this._settings.LevelName.length > 0) {
        jQuery("div#divDate").text(
          this._settings.LevelName + " | " + this._settings.CurrDate
        );
      } else {
        jQuery("div#divDate").text(this._settings.CurrDate);
      }

      this._rawData.ValueFinal = [];
      this._rawData.ValueFinal = Helpers.ProcessRawDataValue(
        this._rawData.Value,
        this._settings
      );
      this._settings.originalMaxValue = Helpers.ArrayMax(
        this._rawData.ValueFinal
      );
      this._settings.originalMinValue = Helpers.ArrayMin(
        this._rawData.ValueFinal
      );
      jQuery("#upperBoundLimit").val(this._settings.originalMaxValue);
      jQuery("#lowerBoundLimit").val(this._settings.originalMinValue);
      this._settings.maxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
      this._settings.minValue = Helpers.ArrayMin(this._rawData.ValueFinal);

      if (!(callbackFunc === undefined)) {
        callbackFunc();
      }

      // Add the datasetID to the input options
      if (this._settings.EnableUri) {
        const uri = new URI(window.location.href);
        uri.removeSearch("database");
        uri.addSearch("database", this._settings.Dataset_ID);
        window.history.replaceState("", "", uri.search());
      }
    });
  }

  public LoadSphereData(callbackFunc) {
    const filename =
      this._serverString +
      "assets/g_GetGridData.php" +
      "?dbname=" +
      this._settings.DatabaseStore +
      "&date=" +
      this._settings.CurrDate +
      "&level=" +
      this._settings.Level_ID;
    const datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then(result => {
      this._rawData = result;
      if (this._settings.LevelName.length > 0) {
        jQuery("div#divDate").text(
          this._settings.LevelName + " | " + this._settings.CurrDate
        );
      } else {
        jQuery("div#divDate").text(this._settings.CurrDate);
      }

      this._rawData.ValueFinal = [];
      this._rawData.ValueFinal = Helpers.ProcessRawDataValue(
        this._rawData.Value,
        this._settings
      );
      this._settings.originalMaxValue = Helpers.ArrayMax(
        this._rawData.ValueFinal
      );
      this._settings.originalMinValue = Helpers.ArrayMin(
        this._rawData.ValueFinal
      );
      jQuery("#upperBoundLimit").val(this._settings.originalMaxValue);
      jQuery("#lowerBoundLimit").val(this._settings.originalMinValue);
      this._settings.maxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
      this._settings.minValue = Helpers.ArrayMin(this._rawData.ValueFinal);

      if (!(callbackFunc === undefined)) {
        callbackFunc();
      }

      // Add the datasetID to the input options
      if (this._settings.EnableUri) {
        const uri = new URI(window.location.href);
        uri.removeSearch("database");
        uri.addSearch("database", this._settings.Dataset_ID);
        window.history.replaceState("", "", uri.search());
      }
    });
  }

  public LoadJscData(fileToLoad, callbackFunc) {
    const datasetLoader = this._getJson.getAll(fileToLoad);
    let resultsToReturn;
    datasetLoader.then(result => {
      resultsToReturn = result;
    });

    if (!(callbackFunc === undefined)) {
      callbackFunc();
    }
    return resultsToReturn;
  }

  public LoadTimeseriesData() {
    const filename =
      this._serverString +
      "assets/g_GetTimeseriesData.php?dbname=" +
      this._settings.DatabaseStore +
      "&gridboxId=" +
      this._settings.CurrGridBoxId +
      "&level=" +
      this._settings.Level_ID;
    const datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then(result => {
      this._rawTimeseriesData = result;

      document.getElementById("timeSeries").style.display = "block";

      // Set Timeseries Buttons
      jQuery("#TimeSeriesLevels").empty();
      for (let i = 0; i < this._levels.Name.length; i++) {
        let checked = "";
        if (this._settings.Level_ID === this._levels.Level_ID[i]) {
          checked = 'checked="checked"';
        }
        const level_id = this._levels.Level_ID[i];
        const name = this._levels.Name[i];

        const timeBtn = jQuery(
          '<label for="timeseries_' +
            level_id +
            '">' +
            name +
            "</label>" +
            '<input type="checkbox" onclick="UI.ChangeTimeSeries(this);" ' +
            checked +
            ' name="timeseries_' +
            level_id +
            '" id="timeseries_' +
            level_id +
            '">'
        );
        timeBtn.appendTo("#TimeSeriesLevels");

        jQuery(() => {
          jQuery("input").button();
          // $( "input" ).checkboxradio();
        });
      }

      // GenerateFirstTimeSeriesChart(this._settings.Level_ID);
    });
  }
}
