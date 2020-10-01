import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from "@angular/material";
import {TimeseriesData} from "../timeseriesData";

@Component({
  selector: "app-time-series-seasonal-chart",
  templateUrl: "./seasonal-chart.component.html",
  styleUrls: ["./seasonal-chart.component.css"]
})

export class SeasonalChartComponent implements OnInit {
  multi: TimeseriesData[] = new Array<any>();
  dataSource: any;
  public _SeasonalValues: Array<{
    Levels: string;
    January: {mean: number, std: number};
    February: {mean: number, std: number};
    March:  {mean: number, std: number};
    April:  {mean: number, std: number};
    May:  {mean: number, std: number};
    June:  {mean: number, std: number};
    July:  {mean: number, std: number};
    August:  {mean: number, std: number};
    September:  {mean: number, std: number};
    October:  {mean: number, std: number};
    November:  {mean: number, std: number};
    December:  {mean: number, std: number};
  }>
  dataColumns = [
    "Levels",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  labels = [
    "Levels",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  displayedColumns = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private dialogRef: MatDialogRef<SeasonalChartComponent>) {
    // passing data as an object throws errors, so I am not able to inject _model to this dialog :(
    this.multi = data;
    this.dialogRef = dialogRef;
    this._SeasonalValues = [];
  }

  private closeSeasonalMenu(menu) {
    // closes seasonal menu dialog
    this.dialogRef.close(menu);
  }

  ngOnInit(): void {
    this.GetData();
    this.transpose();
    this.fillLabels();
  }

  private transpose() {
    const transposedData = [];
    for (let column = 0; column < this.dataColumns.length; column++) {
      transposedData[column] = {
        label: this.labels[column]
      };
      for (let row = 0; row < this._SeasonalValues.length; row++) {
        transposedData[column][`column${row}`] = this._SeasonalValues[row][
          this.dataColumns[column]
          ];
      }
    }
    this.dataSource = new MatTableDataSource(transposedData);
  }

  private fillLabels() {
    // fills the labels for the data table
    this.displayedColumns = [];
    this.displayedColumns = ["label"];
    for (let i = 0; i < this._SeasonalValues.length; i++) {
      this.displayedColumns.push("column" + i);
    }
  }

  private getMonthAverage(currTimeseries, month) {
    // returns average of an array with values from a given month
    let sum = 0;
    let counter = 0;
    for (let i = 0; i < currTimeseries.length; i++) {
      if (currTimeseries[i].name.includes(month)) {
        sum += currTimeseries[i].value;
        counter++;
      }
    }
    return parseFloat((sum / counter).toFixed(3));
  }

  private getMonthArr(month) {
    return (element) => {
      return element.name.includes(month);
    }
  }

  private getMonthStD(currTimeseries, month) {
    // returns the standard deviation of an array with values from a given month
    const monthArr = currTimeseries.filter(this.getMonthArr(month));
    const n = monthArr.length;
    const monthValArr = [];
    for (let i = 0; i < n; i++) {
      monthValArr.push(monthArr[i].value);
    }
    const mean = monthValArr.reduce((a, b) => a + b) / n;
    return parseFloat(Math.sqrt(monthValArr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n).toFixed(3));
  }

  private GetData() {
    // gets the data that will be put into the data table
    length = this.multi.length > 5 ? 5 : this.multi.length;
    for (let counter = 0; counter < length; counter++) {
      const currTS = this.multi[counter].series;
      this._SeasonalValues.push({
        Levels: this.multi[counter].name,
        January: {mean: this.getMonthAverage(currTS, "-01"), std: this.getMonthStD(currTS, "-01")},
        February: {mean: this.getMonthAverage(currTS, "-02"), std: this.getMonthStD(currTS, "-02")},
        March: {mean: this.getMonthAverage(currTS, "-03"), std: this.getMonthStD(currTS, "-03")},
        April: {mean: this.getMonthAverage(currTS, "-04"), std: this.getMonthStD(currTS, "-04")},
        May: {mean: this.getMonthAverage(currTS, "-05"), std: this.getMonthStD(currTS, "-05")},
        June: {mean: this.getMonthAverage(currTS, "-06"), std: this.getMonthStD(currTS, "-06")},
        July: {mean: this.getMonthAverage(currTS, "-07"), std: this.getMonthStD(currTS, "-07")},
        August: {mean: this.getMonthAverage(currTS, "-08"), std: this.getMonthStD(currTS, "-08")},
        September: {mean: this.getMonthAverage(currTS, "-09"), std: this.getMonthStD(currTS, "-09")},
        October: {mean: this.getMonthAverage(currTS, "-10"), std: this.getMonthStD(currTS, "-10")},
        November: {mean: this.getMonthAverage(currTS, "-11"), std: this.getMonthStD(currTS, "-11")},
        December: {mean: this.getMonthAverage(currTS, "-12"), std: this.getMonthStD(currTS, "-12")}
      });
    }
  }
}
