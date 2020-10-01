// formats the data for use with ngx-charts, specifically for the seasonal time series chart
export class SeasonalTimeSeriesData {
  public name: string;
  public series: Array<{
    value: number;
    name: string;
  }>;

  constructor(name: string, TimeSeriesData: any, currMon: number) {
    const series = new Array<{
      value: number;
      name: string;
    }>();
    for (
      let counter = 0;
      counter < TimeSeriesData.length;
      counter++
    ) {
      const currVal = TimeSeriesData[counter].value;
      let currDate;
      (currMon < 12) ? currDate = TimeSeriesData[counter].name.substring(0, 4) :
        currDate = TimeSeriesData[counter].name;

      series.push({
        value: currVal,
        name: currDate
      });
    }

    this.name = name;
    this.series = series;
  }
}
