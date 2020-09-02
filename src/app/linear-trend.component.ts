import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";
import { encodeUriFragment } from "@angular/router/src/url_tree";
import { Model } from "./model";
import { TimeseriesData } from "./timeseriesData";
declare var d3: any;
@Component({
  selector: "app-linear-trend",
  templateUrl: "./linear-trend.component.html",
  styleUrls: ["./linear-trend.component.css"]
})
export class LinearTrendComponent implements OnInit, AfterViewInit {
  private obj: Array<{
    slope: number;
    intercept: number;
    rSquare: number;
  }>;
  multi: TimeseriesData[] = new Array<any>();
  private _model: Model;
  private equation = "";
  private currMonth = "01";
  months = [
    { value: "01", viewValue: "January" },
    { value: "02", viewValue: "February" },
    { value: "03", viewValue: "March" },
    { value: "04", viewValue: "April" },
    { value: "05", viewValue: "May" },
    { value: "06", viewValue: "June" },
    { value: "07", viewValue: "July" },
    { value: "08", viewValue: "August" },
    { value: "09", viewValue: "September" },
    { value: "10", viewValue: "October" },
    { value: "11", viewValue: "November" },
    { value: "12", viewValue: "December" },
    { value: "13", viewValue: "Annual" }
  ];
  private currTimeseries: Array<{ value: number; name: string }>;
  private title: string;
  private annual: Array<{ value: number; name: string }>;
  private currlevel: string;
  private rquare: any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LinearTrendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.multi = data.data;
    this.title = data.title;
    this._model = data.model;
    this.dialogRef = dialogRef;
    this.currlevel = this.multi[0].name;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if(this._model.settings.FullName.includes("Long Term")){
      alert("Cannot Display Linear Trend For The Selected Data")
      this.closeLinearTrend()

    }
    this.GetData(this.currMonth, this.currlevel);
  }
  private GetLevels() {
    return this.multi;
  }

  private leastSquares(input_x, input_y) {
    this.obj = [];
    const reduceSumFunc = (prev, cur) => prev + cur;
    // Getting the average of x and y which is xbar and ybar
    const x_bar = (input_x.reduce(reduceSumFunc) * 1.0) / input_x.length;
    const y_bar = (input_y.reduce(reduceSumFunc) * 1.0) / input_y.length;

    // SSxx = summation((x - x_bar)**2)
    const SSxx = input_x.map(o => Math.pow(o - x_bar, 2)).reduce(reduceSumFunc);

    // SSyy = summation((y-y_bar)**2
    const SSyy = input_y.map(d => Math.pow(d - y_bar, 2)).reduce(reduceSumFunc);

    // SSxy = summation((x-x_bar)(y-y_bar))
    const SSxy = input_x
      .map((d, i) => (d - x_bar) * (input_y[i] - y_bar))
      .reduce(reduceSumFunc);

    // slope = summation( (x-x_bar) * (y-y_bar))/summation(x-x_bar) which is SSxy/SSxx
    const slope = SSxy / SSxx;
    const intercept = y_bar - x_bar * slope;

    const rSquare = Math.pow(SSxy, 2) / (SSxx * SSyy);

    this.obj.push({
      slope,
      intercept,
      rSquare
    });
    return this.obj;
  }

  public DataAvailable() {
    return this.multi.length > 0;
  }
  private GetData(month, level) {
    this.currTimeseries = [];
    for (let counter = 0; counter < this.multi.length; counter++) {
      if (this.multi[counter].name.match(level)) {
        this.currTimeseries = this.multi[counter].series.filter((o, i) => {
          if (month === o.name.substr(5, 7)) {
            return o;
          }
        });
        break;
      }
    }
    this.GetLinearTrend();
  }

  public GetUpdatedData(month, level) {
    d3.selectAll("#chart > *").remove();
    if (month === "13") {
      this.GetAnnualData(level);
    } else {
      this.GetData(month, level);
    }
  }

  public GetAnnualData(level) {
    this.currTimeseries = [];
    for (let counter = 0; counter < this.multi.length; counter++) {
      if (this.multi[counter].name.match(level)) {
        this.annual = this.multi[counter].series;
      }
    }
    /*
      this.annual.forEach(i => {
        i.name = i.name.substr(0,4)
      });

      const result = this.currTimeseries.reduce((acc, it) => {
        acc[it.name] = acc[it.name] + it.value
        return acc
      },{});

     */
    let sum = 0;
    let count = 0;
    let val = 0;
    for (
      let counter = 0;
      counter < this.annual.length;
      counter = counter + count
    ) {
      count = 0;
      sum = 0;
      for (let i = counter; i < this.annual.length; i++) {
        if (this.annual[counter].name.substr(0, 4) === this.annual[i].name.substr(0, 4)) {
          sum = sum + this.annual[i].value;
          count++;
        } else {
          break;

        }
      }
      val = sum/count;

      this.currTimeseries.push({
        name: this.annual[counter].name.substr(0, 4),
        value: val
      });
    }
    this.GetLinearTrend();
  }
  GetLinearTrend() {
    const margin = { top: 20, right: 50, bottom: 100, left: 100 };
    const width = 900 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
      .scalePoint()
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear().range([height, 50]);

    const xAxis = d3.axisBottom(xScale).ticks(20);

    const yAxis = d3.axisLeft().scale(yScale);

    const xLabels: string[] = this.currTimeseries.map(o => o.name);

    xScale.domain(xLabels);
    yScale.domain(d3.extent(this.currTimeseries.map(o => o.value)));

    /*
    yScale.domain([
      d3.min(this.currTimeseries.map(o => o.value)),
      d3.max(this.currTimeseries.map(o => o.value))
    ]);

     */

    const title = this._model.settings.GenerateTitle(
      this._model.settings.FullName
    ) + " ( Latitude: " + this._model.settings.GetLatWithDir() + " Longitude: " + this._model.settings.GetLonWithDir() + " )"

    // chart title
    svg.append("text")
      .attr("x", (width)/2 + 10)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("font-weight", 600)
      .style("font-family", "sans-serif")
      .text(title);


    // y axis label
    svg
      .append("text")
      .attr("x", (margin.left - width + 20) / 2)
      .attr("y", margin.right - margin.bottom - 20)
      .attr("class", "text-label")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("transform", "rotate(-90)")
      .text(this.title);

    // x axis label
    svg
      .append("text")
      .attr("x", (width +  margin.right) / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("class", "text-label")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Date");

    // get the x and y values for least squares
    const input_x = d3.range(1, xLabels.length + 1);
    const input_y = this.currTimeseries.map(d => d.value);

    const leastSquaresCoeff = this.leastSquares(input_x, input_y);

    // apply the results of the least squares regression
    const x1 = xLabels[0];
    const y1 = leastSquaresCoeff[0].slope + leastSquaresCoeff[0].intercept;
    const x2 = xLabels[xLabels.length - 1];
    const y2 =
      leastSquaresCoeff[0].slope * input_x.length +
      leastSquaresCoeff[0].intercept;
    const trendData = [[x1, y1, x2, y2]];

    svg
      .append("line")
      .attr("class", "regression")
      .attr("x1", xScale(x1))
      .attr("y1", yScale(y1))
      .attr("x2", xScale(x2))
      .attr("y2", yScale(y2))
      .attr("stroke", "blue")
      .attr("stroke-width", 5)
      .attr("stroke-dasharray", 10, 5);

    // display equation on the chart
    svg
      .append("text")
      .text(
        "Equation : " +
          leastSquaresCoeff[0].slope.toFixed(5) +
          " x + " +
          leastSquaresCoeff[0].intercept.toFixed(3)
      )
      .attr("class", "text-label")
      .attr("font-weight", 900)
      .attr("fill", "blue")
      .style("font-size", "16px")
      .attr("x", margin.left/2 - 20)
      .attr("y", 30);

    // display r-square on the chart
    svg
      .append("text")
      .text("R-Squared : " + leastSquaresCoeff[0].rSquare.toFixed(3))
      .attr("class", "text-label")
      .attr("font-weight", 900)
      .style("font-size", "16px")
      .attr("fill", "blue")
      .attr("x", margin.left/2 - 20)
      .attr("y", 60);

    const x_ticks = Math.round(xLabels.length / 20);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(
        xAxis.tickValues(
          xLabels.filter((o, i) => {
            if (i % x_ticks === 0) {
              return o;
            }
          })
        )
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".12em")
      .style("font-size", 14)
      .attr("transform", d => "rotate(-90)");

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(this.currTimeseries)
      .enter()
      .append("circle")
      .attr("class", "bar")
      .attr("cx", d => xScale(d.name))
      .attr("cy", d => yScale(d.value))
      .attr("r", 2.5)
      .attr("color", "gray");
  }
  closeLinearTrend() {
    this.dialogRef.close();
  }
  /*
  yValTitle() {

    const yTitle = this._model.settings.GenerateSimpleTitle(
      this._model.settings.FullName
    );
    if (yTitle.search("Temperature") >= 0) {
      return yTitle.concat(" (\xB0C)");
    } else if (
      yTitle === "Volumetric Soil Moisture" ||
      yTitle === "ice thickness"
    ) {
      return yTitle;
    } else {
      return yTitle + " (" + this._model.settings.DataUnits + ")";
    }
  }

   */
}
