
import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatTableDataSource
} from "@angular/material";
import * as kurtosis from "compute-kurtosis";
import * as skewness from "compute-skewness";
import { GetJson } from "./getJson";
import { TimeseriesData } from "./timeseriesData";

@Component({
  selector: "app-time-series-statistics",
  templateUrl: "./time-series-statistics.component.html",
  styleUrls: ["./time-series-statistics.component.css"]
})
export class TimeSeriesStatisticsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any>;
  public _SummaryStatistics: Array<{
    Levels: string;
    Min: number;
    "25%": number;
    "50%": number;
    Mean: number;
    "75%": number;
    Max: number;
    "Standard Deviation": number;
    Variance: number;
    Skewness: number;
    Kurtosis: number;
  }>;
  multi: TimeseriesData[] = new Array<any>();

  dataColumns = [
    "Levels",
    "Min",
    "25%",
    "50%",
    "Mean",
    "75%",
    "Max",
    "Standard Deviation",
    "Variance",
    "Skewness",
    "Kurtosis"
  ];
  labels = [
    "Levels",
    "Min",
    "25%",
    "50%",
    "Mean",
    "75%",
    "Max",
    "Standard Deviation",
    "Variance",
    "Skewness",
    "Kurtosis"
  ];

  dataSum = 0;
  displayedColumns = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TimeSeriesStatisticsComponent>
  ) {
    this.multi = data;
    this.dialogRef = dialogRef;
    this._SummaryStatistics = [];
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.GetData();
    this.transpose();
    this.fillLabels();
  }

  // Displaying all the calculated data in a tabular form
  private transpose() {
    const transposedData = [];
    for (let column = 0; column < this.dataColumns.length; column++) {
      transposedData[column] = {
        label: this.labels[column]
      };
      for (let row = 0; row < this._SummaryStatistics.length; row++) {
        transposedData[column][`column${row}`] = this._SummaryStatistics[row][
          this.dataColumns[column]
        ];
      }
    }
    this.dataSource = new MatTableDataSource(transposedData);
  }

  // Columns to be displayed on HTML
  private fillLabels() {
    this.displayedColumns = ["label"];
    for (let i = 0; i < this._SummaryStatistics.length; i++) {
      this.displayedColumns.push("column" + i);
    }
  }
  data_Sum(inp_data) {
    return inp_data.reduce((a, b) => a + b.value, 0);
  }

  private Sort_data(inp_data) {
    return inp_data.sort((a, b) => {
      return a.value - b.value;
    });
  }
  private Quartile_25(inp_data) {
    return this.Quartile(inp_data, 0.25);
  }

  private Quartile_50(inp_data) {
    return this.Quartile(inp_data, 0.5);
  }

  private Quartile_75(inp_data) {
    return this.Quartile(inp_data, 0.75);
  }

  // Quartiles are values that divide your data into quarters.
  // Here g is the  quartile that we need to compute
  private Quartile(d, q) {
    d = this.Sort_data(d);
    const pos = (d.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (d[base + 1] !== undefined) {
      return (
        d[base].value + rest * (d[base + 1].value - d[base].value)
      );
    } else {
      return d[base].value;
    }
  }

  // calculating average
  private Calc_average(inp_data) {
    return this.data_Sum(inp_data) / inp_data.length;
  }
  // Calculating Variance sum of the squared distances of each term in the distribution
  // from the mean (μ), divided by the number of terms in the distribution
  private Calc_variance(inp_data) {
    const avg = this.Calc_average(inp_data);
    return (
      inp_data.map(x => Math.pow(x.value - avg, 2)).reduce((a, b) => a + b) /
      inp_data.length
    );
  }

  // Calculating Standard Deviation which is Square Root of Variance
  private Calc_standardDeviation(inp_data) {
    return Math.sqrt(this.Calc_variance(inp_data));
  }

  // Calculate the Summary Statistics
  private GetData() {
    // Setting limit to display on 5 levels
    length = this.multi.length > 5 ? 5 : this.multi.length;
    for (let counter = 0; counter < length; counter++) {
      const currTimeseries = this.multi[counter].series.map(x => Object.assign({}, x));
      //const currTimeseries = deepCopy(this.multi[counter].series);
     // this.cTimeseries = currTimeseries;
      this._SummaryStatistics.push({
        Mean: parseFloat(this.Calc_average(currTimeseries).toFixed(3)),
        Min: Math.min
          .apply(
            Math,
            currTimeseries.map(o => o.value)
          )
          .toFixed(3),
        Max: Math.max
          .apply(
            Math,
            currTimeseries.map(o => o.value)
          )
          .toFixed(3),
        Levels: this.multi[counter].name,
        "25%": this.Quartile(currTimeseries, 0.25).toFixed(3),
        "50%": this.Quartile(currTimeseries, 0.5).toFixed(3),
        "75%": this.Quartile(currTimeseries, 0.75).toFixed(3),
        "Standard Deviation": parseFloat(
          this.Calc_standardDeviation(currTimeseries).toFixed(3)
        ),
        Variance: parseFloat(this.Calc_variance(currTimeseries).toFixed(3)),
        Kurtosis: kurtosis(currTimeseries.map(o => o.value)).toFixed(3),
        Skewness: skewness(currTimeseries.map(o => o.value)).toFixed(3)
      });
    }
  }
  private closeStatistics() {
    this.dialogRef.close();
  }
}
