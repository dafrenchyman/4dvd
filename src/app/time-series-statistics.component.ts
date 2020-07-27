import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { GetJson } from './getJson';
import { TimeseriesData } from './timeseriesData';
import * as kurtosis from 'compute-kurtosis';
import * as skewness from 'compute-skewness';

@Component({
  selector: 'app-time-series-statistics',
  templateUrl: './time-series-statistics.component.html',
  styleUrls: ['./time-series-statistics.component.css']
})
export class TimeSeriesStatisticsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  public _SummaryStatistics: Array<{
    Level: string;
    Min: number;
    '25%': number;
    '50%': number;
    Mean: number;
    '75%': number;
    Max: number;
    Standard_Deviation: number;
    Variance: number;
    Skewness: number;
    Kurtosis: number;
  }>;
  multi: TimeseriesData[] = new Array<any>();
  dataColumns = [
    'Level',
    'Min',
    '25%',
    '50%',
    'Mean',
    '75%',
    'Max',
    'Standard_Deviation',
    'Variance',
    'Skewness',
    'Kurtosis'
  ];
  labels = [
    'Level',
    'Min',
    '25%',
    '50%',
    'Mean',
    '75%',
    'Max',
    'Standard_Deviation',
    'Variance',
    'Skewness',
    'Kurtosis'
  ];

  dataSum=0;
  displayedColumns = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TimeSeriesStatisticsComponent>
  ) {

    this.multi = data;
    this.dialogRef = dialogRef;
    this._SummaryStatistics = []
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
  
    this.GetData();
    this.transpose();
    this.fillLabels();
    
  }
  transpose() {
    let transposedData = [];
    for (let column = 0; column < this.dataColumns.length; column++) {
      transposedData[column] = {
        label: this.labels[column]
      };
      for (let row = 0; row < this._SummaryStatistics.length; row++) {
        transposedData[column][`column${row}`] = this._SummaryStatistics[row][this.dataColumns[column]];
      }
    }
    this.dataSource = new MatTableDataSource(transposedData);
  }

  fillLabels() {
    this.displayedColumns = ['label'];
    for (let i = 0; i < this.data.length; i++) {
      this.displayedColumns.push('column' + i);
    }
  }
  data_Sum(inp_data){
    return inp_data.reduce(function(a, b) { return a + b.value; }, 0); 
  }

  Sort_data(inp_data){
    return inp_data.sort(function(a, b) {
      return a.value - b.value;
    });
  }
  Quartile_25(inp_data) {
    return this.Quartile(inp_data, 0.25);
  }
  
  Quartile_50(inp_data) {
    return this.Quartile(inp_data, 0.5);
  }
  
  Quartile_75(inp_data) {
    return this.Quartile(inp_data, 0.75);
  }
  
  Quartile(data, q) {
    data=this.Sort_data(data);
    var pos = ((data.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (data[base+1]!==undefined) ) {
      return data[base].value + rest * (data[base+1].value - data[base].value);
    } else {
      return data[base].value;
    }
  }

  Calc_average(inp_data){
    return this.data_Sum(inp_data)/inp_data.length
  }
  Calc_variance(inp_data){
    const avg = this.Calc_average(inp_data);
    return inp_data.map(x => Math.pow(x.value - avg, 2)).reduce((a, b) => a + b) / inp_data.length;
  }

  Calc_standardDeviation(inp_data){
    return Math.sqrt(this.Calc_variance(inp_data));
  }

  GetData(){
    for (let counter = 0; counter < this.multi.length; counter++) {
      const currTimeseries = this.multi[counter].series;
      this._SummaryStatistics.push({
        Mean: parseFloat(this.Calc_average(currTimeseries).toFixed(3)),
        Min: Math.min.apply(Math, currTimeseries.map(function(o) { return o.value; })).toFixed(3),
        Max: Math.max.apply(Math, currTimeseries.map(function(o) { return o.value; })).toFixed(3),
        Level: this.multi[counter].name,
        '25%': this.Quartile(currTimeseries,.25).toFixed(3),
        '50%': this.Quartile(currTimeseries,.50).toFixed(3),
        '75%': this.Quartile(currTimeseries,.75).toFixed(3),
        Standard_Deviation: parseFloat(this.Calc_standardDeviation(currTimeseries).toFixed(3)),
        Variance: parseFloat(this.Calc_variance(currTimeseries).toFixed(3)),
        Kurtosis: kurtosis(currTimeseries.map(function(o) { return o.value; })).toFixed(3),
        Skewness: skewness(currTimeseries.map(function(o) { return o.value; })).toFixed(3)
      }); 
      
    }
  }
 
  
}
