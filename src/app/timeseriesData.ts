import { Helpers } from "./helpers";
/**
 * Created by dafre on 7/16/2017.
 */

export class TimeseriesData {
  public name: string;
  public level_ID: number;
  public loaded: boolean;
  public visible: boolean;
  public series: Array<{
    value: number;
    name: string;
  }>;

  constructor(
    name: string,
    level_ID: number,
    rawTimeseriesData: any,
    userData?: any
  ) {
    const series = new Array<{
      value: number;
      name: string;
    }>();
    for (
      let counter = 0;
      counter < rawTimeseriesData.ValueFinal.length;
      counter++
    ) {
      let currDate;
      userData
        ? (currDate = rawTimeseriesData.Date.substring(0, 7))
        : (currDate = rawTimeseriesData.Date[counter].substring(0, 7));
      const currValue = rawTimeseriesData.ValueFinal[counter];
      series.push({
        value: currValue,
        name: currDate
      });
    }

    this.name = name;
    this.level_ID = level_ID;
    this.loaded = true;
    this.visible = true;
    this.series = series;
  }
}
