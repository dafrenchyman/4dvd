import { Helpers } from "./helpers";
import { Settings } from "./settings";
/**
 * Created by dafre on 5/14/2017.
 */

declare var jQuery: any;
declare var c3: any;

export class Timeseries {
  public TimeSeriesChart: any;
  public FinalTimeSeriesData: any;

  private _settings: Settings;
  public constructor(settings: Settings) {
    this._settings = settings;
  }

  public GenerateFirstTimeSeriesChart(RawTimeseriesData, Levels, level_id) {
    if (this._settings.CurrGridBoxId > 0) {
      RawTimeseriesData.ValueFinal = Helpers.ProcessRawDataValue(
        RawTimeseriesData.Value,
        this._settings
      );
      this.FinalTimeSeriesData = new Map();

      const Dates = [];
      const Values = [];
      for (
        let counter = 0;
        counter < RawTimeseriesData.ValueFinal.length;
        counter++
      ) {
        const currDate = RawTimeseriesData.Date[counter];
        const currValue = RawTimeseriesData.ValueFinal[counter];
        Dates.push(currDate);
        Values.push(currValue);
      }
      this.FinalTimeSeriesData.set(level_id, { Date: Dates, Value: Values });

      const timeSeriesArray = [];
      const timeData_date = this.FinalTimeSeriesData.get(level_id).Date.slice(
        0
      );
      timeData_date.unshift("Date");
      const timeData_data = this.FinalTimeSeriesData.get(level_id).Value.slice(
        0
      );
      const levelIndex = Levels.Level_ID.indexOf(level_id.toString());
      const levelName = Levels.Name[levelIndex];
      timeSeriesArray.push(timeData_date);
      timeData_data.unshift(levelName);
      timeSeriesArray.push(timeData_data);

      this.TimeSeriesChart = c3.generate({
        bindto: "#TimeSeriesChart",
        data: {
          x: "Date",
          columns: timeSeriesArray,
          onclick(d, element) {
            // ChangeDate(RawTimeseriesData.Date[d.index], function(){LoadSphereData(this._settings);});
          }
        },
        axis: {
          x: {
            label: "Date",
            type: "timeseries",
            tick: {
              format: "%Y-%m"
            }
          },
          y: {
            label: "Temperature (" + this._settings.TemperatureSymbol + ")"
          }
        },
        zoom: { enabled: true },
        transition: { duration: 0 }
      });
    }
  }

  /***
   *
   * @param level_id
   * @constructor
   */
  RemoveLevelFromTimeSeries(Levels, level_id) {
    const levelIndex = Levels.Level_ID.indexOf(level_id.toString());
    const levelName = Levels.Name[levelIndex];
    this.TimeSeriesChart.load({
      unload: [levelName]
    });
  }

  AddLevelsToTimeSeries(RawTimeseriesData, Levels, level_id) {
    if (this._settings.CurrGridBoxId > 0) {
      if (!this.FinalTimeSeriesData.has(level_id)) {
        RawTimeseriesData.ValueFinal = Helpers.ProcessRawDataValue(
          RawTimeseriesData.Value,
          this._settings
        );
        const Dates = [];
        const Values = [];
        for (
          let counter = 0;
          counter < RawTimeseriesData.ValueFinal.length;
          counter++
        ) {
          const currDate = RawTimeseriesData.Date[counter];
          const currValue = RawTimeseriesData.ValueFinal[counter];
          Dates.push(currDate);
          Values.push(currValue);
        }
        this.FinalTimeSeriesData.set(level_id, { Date: Dates, Value: Values });
      }

      const timeSeriesArray = [];
      const timeData_data = this.FinalTimeSeriesData.get(level_id).Value.slice(
        0
      );
      const levelIndex = Levels.Level_ID.indexOf(level_id.toString());
      const levelName = Levels.Name[levelIndex];
      timeData_data.unshift(levelName);
      timeSeriesArray.push(timeData_data);
      this.TimeSeriesChart.load({
        columns: timeSeriesArray
      });
    }
  }

  createCsvFromTimeseriesData(Levels) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Create the header
    csvContent += "Level Name,Date,Value\n";

    if (this.FinalTimeSeriesData.size > 0) {
      this.FinalTimeSeriesData.forEach((currTimeData, level_id) => {
        const levelIndex = Levels.Level_ID.indexOf(level_id.toString());
        const levelName = Levels.Name[levelIndex];

        for (let i = 0; i < currTimeData.Date.length; i++) {
          const dataString =
            levelName +
            "," +
            currTimeData.Date[i] +
            "," +
            currTimeData.Value[i];
          csvContent += dataString + "\n";
        }
      }, this.FinalTimeSeriesData);

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        this._settings.DatabaseStore +
          "_Timeseries_Lat" +
          this._settings.CurrGridBoxLat +
          "_Lon" +
          this._settings.CurrGridBoxLon +
          ".csv"
      );
      link.click();
    } else {
      jQuery("#dialogNoData").dialog("open");
    }

    /*if (RawTimeseriesData.Level_ID.length > 0) {
     for (var i = 0; i < RawTimeseriesData.Level_ID.length; i++) {

     var currLevelId = RawTimeseriesData.Level_ID[i];
     var levelIndex = Levels.Level_ID.indexOf(currLevelId.toString());
     var levelName = Levels.Name[levelIndex];

     var dataString = levelName + "," + RawTimeseriesData.Date[i] + "," + RawTimeseriesData.ValueFinal[i];
     csvContent += dataString + "\n";
     }

     var encodedUri = encodeURI(csvContent);
     var link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", LayerSettings.DatabaseStore +
     "_Timeseries_Lat" + LayerSettings.CurrGridBoxLat +
     "_Lon" + LayerSettings.CurrGridBoxLon + ".csv");
     link.click();
     */
  }
}
