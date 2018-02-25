import {Helpers} from "./helpers";
/**
 * Created by dafre on 7/16/2017.
 */


export class  TimeseriesData {
  public name: string;
  public level_ID: number;
  public loaded: boolean;
  public visible: boolean;
  public series: {
    value: number, name: string
  }[];

  constructor(name: string, level_ID: number, rawTimeseriesData: any) {
    var series = new Array<{
      value: number,
      name: string
    }>();
    for (var counter = 0; counter < rawTimeseriesData.ValueFinal.length; counter++) {
      var currDate = rawTimeseriesData.Date[counter];
      var currValue = rawTimeseriesData.ValueFinal[counter];
      series.push({
        value : currValue,
        name: currDate
      });
    }

    this.name = name;
    this.level_ID = level_ID;
    this.loaded = true;
    this.visible = true;
    this.series = series;
  };
}
