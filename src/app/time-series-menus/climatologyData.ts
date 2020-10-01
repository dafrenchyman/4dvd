// formats the data for use with ngx-charts, specifically for the climatology graph
export class ClimatologyData {
  public name: string;
  public series: Array<{
    value: number;
    name: string;
  }>;

  monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  constructor(name: string, climatologyData: any) {
    const series = new Array<{
      value: number;
      name: string;
    }>();
    for (
      let counter = 0;
      counter < climatologyData.length;
      counter++
    ) {
      const currVal = climatologyData[counter];
      const currMon = this.monthArr[counter];
      series.push({
        value: currVal,
        name: currMon
      });
    }

    this.name = name;
    this.series = series;
  }
}
