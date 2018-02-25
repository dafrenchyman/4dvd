/**
 * Created by dafre on 5/14/2017.
 */

import {Settings} from "./settings";
import {Helpers} from "./helpers";
import {GetJson} from "./getJson";
import {Dataset} from "./Dataset";

declare var jQuery: any;
declare var URI: any;

export class Loaders {
  MenuItems : any;
  MenuData : any[];

  private _settings : Settings;
  private _getJson : GetJson;
  private _levels: any;
  private _serverString : string;
  private _rawData : any;
  private _rawTimeseriesData : any;

  public constructor(getJson : GetJson, settings : Settings) {
    this._settings = settings;
    this._getJson = getJson;
    this._serverString = settings.ServerString;

    this.MenuData = new Array();
    this.MenuItems = new Object();

    // Begin
    this.LoadDatasets();
  }

  public LoadDatasets () {
    // Load with Angular2
    var datasetLoader = this._getJson.getAll(this._serverString + 'assets/g_datasets.php');
    datasetLoader.then( result => {
      var results : any = result;
      var currId = 0;
      var MenuDataFull : Dataset[] = [];
      //this.MenuItems.id = 0;
      for (var counter = 0; counter < results.Name.length; counter++)
      {
        var datasetStructure = results.Name[counter].split("|");
        var currStructure = datasetStructure;
        var currMenu = this.MenuItems;
        var parentId = 0;
        for (var structCounter = 0; structCounter < currStructure.length; structCounter++) {
          var currProperty = currStructure[structCounter];
          if(!currMenu.hasOwnProperty(currProperty)) {
            currMenu[currProperty] = {};
            currMenu[currProperty].id = ++currId;
            currMenu[currProperty].parentId = parentId;
            if (structCounter === currStructure.length - 1) {
              MenuDataFull.push(new Dataset(
                {
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
                parentId: parentId,
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
                parentId: parentId,
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

  public LoadLevelData () :any {
    var filename = this._serverString + 'assets/g_GetLevel.php' +'?dbname=' + this._settings.DatabaseStore;
    var datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then( result => {
      this._levels = result;

      // Layer Selection buttons
      jQuery("#Levels").empty();
      for (var i = 0; i < this._levels.Name.length; i++) {
        var checked = '';
        if (i == 0) {
          checked = 'checked="checked"'
        }
        var level_id = this._levels.Level_ID[i];
        var name = this._levels.Name[i];

        // Layers
        var radioBtn = jQuery('<input type="radio" id="levelRadio' + parseInt(level_id) +
          '" onchange="UI.changeLevel(this.value, function(){UI.LoadSphereData();})" value="' + level_id +
          '" name="levelRadio" ' + checked + '><label for="levelRadio' + level_id + '">' + name + '</label>');
        radioBtn.appendTo('#Levels');
      }
      //$("#Levels").buttonset();
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

  public LoadSphereDataMenu (callbackFunc) {
    var filename = this._serverString + 'assets/g_GetGridData.php' +
      '?dbname=' + this._settings.DatabaseStore + '&date=' + this._settings.CurrDate +
      '&level=' + this._settings.Level_ID;
    var datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then( result => {
      this._rawData = result;
        if(this._settings.LevelName.length > 0) {
          jQuery("div#divDate").text(this._settings.LevelName + ' | ' + this._settings.CurrDate);
        } else {
          jQuery("div#divDate").text(this._settings.CurrDate);
        }

        this._rawData.ValueFinal = [];
        this._rawData.ValueFinal = Helpers.ProcessRawDataValue(this._rawData.Value, this._settings);
        this._settings.originalMaxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
        this._settings.originalMinValue = Helpers.ArrayMin(this._rawData.ValueFinal);
        jQuery("#upperBoundLimit").val(this._settings.originalMaxValue);
        jQuery("#lowerBoundLimit").val(this._settings.originalMinValue);
        this._settings.maxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
        this._settings.minValue = Helpers.ArrayMin(this._rawData.ValueFinal);

        if (!(callbackFunc === undefined)) {
          callbackFunc();
        }

        // Add the datasetID to the input options
        var uri = new URI(window.location.href);
        uri.removeSearch("database");
        uri.addSearch("database", this._settings.Dataset_ID);
        window.history.replaceState("", "", uri.search());
    });
  }

  public LoadSphereData (callbackFunc) {

    var filename = this._serverString + 'assets/g_GetGridData.php' +
      '?dbname=' + this._settings.DatabaseStore + '&date=' + this._settings.CurrDate +
      '&level=' + this._settings.Level_ID;
    var datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then( result => {
      this._rawData = result;
      if(this._settings.LevelName.length > 0) {
        jQuery("div#divDate").text(this._settings.LevelName + ' | ' + this._settings.CurrDate);
      } else {
        jQuery("div#divDate").text(this._settings.CurrDate);
      }

      this._rawData.ValueFinal = [];
      this._rawData.ValueFinal = Helpers.ProcessRawDataValue(this._rawData.Value, this._settings);
      this._settings.originalMaxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
      this._settings.originalMinValue = Helpers.ArrayMin(this._rawData.ValueFinal);
      jQuery("#upperBoundLimit").val(this._settings.originalMaxValue);
      jQuery("#lowerBoundLimit").val(this._settings.originalMinValue);
      this._settings.maxValue = Helpers.ArrayMax(this._rawData.ValueFinal);
      this._settings.minValue = Helpers.ArrayMin(this._rawData.ValueFinal);

      if (!(callbackFunc === undefined)) {
        callbackFunc();
      }

      // Add the datasetID to the input options
      var uri = new URI(window.location.href);
      uri.removeSearch("database");
      uri.addSearch("database", this._settings.Dataset_ID);
      window.history.replaceState("", "", uri.search());
    });
  }

  public LoadJscData (fileToLoad, callbackFunc) {
    var datasetLoader = this._getJson.getAll(fileToLoad);
    var resultsToReturn;
    datasetLoader.then( result => {
      resultsToReturn = result;
    });

    if (!(callbackFunc === undefined)) {
      callbackFunc();
    }
    return resultsToReturn;
  }

  public LoadTimeseriesData () {
    var filename = this._serverString +
      'assets/g_GetTimeseriesData.php?dbname=' + this._settings.DatabaseStore +
      '&gridboxId=' + this._settings.CurrGridBoxId +
      '&level=' + this._settings.Level_ID;
    var datasetLoader = this._getJson.getAll(filename);
    datasetLoader.then( result => {
      this._rawTimeseriesData = result;

      document.getElementById("timeSeries").style.display = "block";

      // Set Timeseries Buttons
      jQuery("#TimeSeriesLevels").empty();
      for (var i = 0; i < this._levels.Name.length; i++) {
        var checked = '';
        if (this._settings.Level_ID == this._levels.Level_ID[i]) {
          checked = 'checked="checked"'
        }
        var level_id = this._levels.Level_ID[i];
        var name = this._levels.Name[i];

        var timeBtn = jQuery('<label for="timeseries_'+ level_id + '">' + name + '</label>' +
          '<input type="checkbox" onclick="UI.ChangeTimeSeries(this);" ' + checked + ' name="timeseries_'+ level_id + '" id="timeseries_'+ level_id +'">');
        timeBtn.appendTo('#TimeSeriesLevels');

        jQuery( function() {
          jQuery('input').button();
          //$( "input" ).checkboxradio();
        } );

      }

      //GenerateFirstTimeSeriesChart(this._settings.Level_ID);
    });
  }

  /*
  AddTimeseriesData (level_id) {
    if (!FinalTimeSeriesData.has(level_id)) {
      var head = document.getElementsByTagName('head')[0];
      try {
        head.removeChild(d.getElementById('LoadTimeseriesData'));
      } catch (e) {
      }
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'LoadTimeseriesData';
      script.src = 'php/g_GetTimeseriesData.php?dbname=' + settings.DatabaseStore + '&gridboxId=' + settings.CurrGridBoxId + '&level=' + level_id;
      script.onload = function () {
        document.getElementById("timeSeries").style.display = "block";
        AddLevelsToTimeSeries(level_id);
      };
      head.appendChild(script);
    } else {
      AddLevelsToTimeSeries(level_id);
    }
  }
  */
}
