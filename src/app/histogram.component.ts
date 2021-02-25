import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatDialog,
  MatDialogRef
} from "@angular/material";
import { Model } from "./model";
import { TimeseriesData } from "./timeseriesData";
import has = Reflect.has;

declare var d3: any;
@Component({
  selector: "app-histogram",
  templateUrl: "./histogram.component.html",
  styleUrls: ["./histogram.component.css"]
})
export class HistogramComponent implements OnInit, AfterViewInit {
  multi: TimeseriesData[] = new Array<any>();
  private currlevel: string;
  private title: string;
  private _model: Model;
  private currTimeSeries: Array<{ value: number; name: string }>;
  nBin = 40;
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
    { value: "13", viewValue: "Dec,Jan,Feb" },
    { value: "14", viewValue: "Mar,Apr,May" },
    { value: "15", viewValue: "Jun,Jul,Aug" },
    { value: "16", viewValue: "Sep,Oct,Nov" }
  ];
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HistogramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.multi = data.data;
    this._model = data.model;
    this.title = data.title;
    this.dialogRef = dialogRef;
    this.currlevel = this.multi[0].name;
    this.currTimeSeries = this.multi[0].series.filter((o, i) => {
      if (this.currMonth === o.name.substr(5, 7)) {
        return o;
      }
    });
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.drawHist();
  }
  private GetLevels() {
    return this.multi;
  }
  public DataAvailable() {
    return this.multi.length > 0;
  }

  public drawHist() {
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    // Set the margins for the chart
    const svg = d3
      .select("#hist_div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const month_name = this.GetMonth();
    const title_name = this._model.settings.GenerateTitle(
      this._model.settings.FullName
    );
    const title =
      month_name +
      " Histogram of " +
      title_name.split("|")[0] +
      "  at  " +
      this.currlevel +
      " ( Lat: " +
      this._model.settings.GetLatWithDir() +
      ", Lon: " +
      this._model.settings.GetLonWithDir() +
      " )";

    // chart title
    svg
      .append("text")
      .attr("x", width / 2 + 20)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("font-weight", 600)
      .style("font-family", "sans-serif")
      .text(title);

    // Setting the x-axis using the range of values
    const x = d3
      .scaleLinear()
      .domain(d3.extent(this.currTimeSeries.map(o => o.value)))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("font-size", "16px");

    // Setting the x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom / 2)
      .attr("class", "text-label")
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text(this.title);

    // Setting the y-axis label
    svg
      .append("text")
      .attr("x", (margin.left - width + 20) / 2)
      .attr("y", margin.right - margin.bottom - 20)
      .attr("class", "text-label")
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .text("Frequency");

    // Y axis: initialization
    const y = d3.scaleLinear().range([height, 0]);

    // set the parameters for the histogram using nBin
    const histogram = d3
      .histogram()
      .value(d => d.value)
      .domain(x.domain())
      .thresholds(x.ticks(this.nBin));

    // getting the data for histogram
    const bins = histogram(this.currTimeSeries);

    y.domain([0, d3.max(bins, d => d.length)]);
    const yAxis = svg
      .append("g")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y))
      .style("font-size", "16px");

    // Join the rect with the bins data
    const u = svg.selectAll("rect").data(bins);

    // Manage the existing bars and eventually the new ones:
    u.enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", 1)
      .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")")
      .attr("width", d => x(d.x1) - x(d.x0))
      .attr("height", d => height - y(d.length))
      .style("fill", "#1f78b4");

    u.exit().remove();
  }

  public UpdateHist(event) {
    d3.selectAll("#hist_div > *").remove();
    this.nBin = event.target.value;
    this.drawHist();
  }
  // returns the Month name for the Month value
  private GetMonth() {
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i].value === this.currMonth) {
        return this.months[i].viewValue;
      }
    }
  }

  public UpdateLevel(month, level) {
    d3.selectAll("#hist_div > *").remove();
    this.currTimeSeries = [];
    if (month >= 13) {
      switch (month) {
        case "13":
          for (let counter = 0; counter < this.multi.length; counter++) {
            if (this.multi[counter].name.match(level)) {
              this.currTimeSeries = this.multi[counter].series.filter(
                (o, i) => {
                  if (
                    o.name.substr(5, 7).includes("12") ||
                    o.name.substr(5, 7).includes("01") ||
                    o.name.substr(5, 7).includes("02")
                  ) {
                    return o;
                  }
                }
              );
              break;
            }
          }
          break;
        case "14":
          for (let counter = 0; counter < this.multi.length; counter++) {
            if (this.multi[counter].name.match(level)) {
              this.currTimeSeries = this.multi[counter].series.filter(
                (o, i) => {
                  if (
                    o.name.substr(5, 7).includes("03") ||
                    o.name.substr(5, 7).includes("04") ||
                    o.name.substr(5, 7).includes("05")
                  ) {
                    return o;
                  }
                }
              );
              break;
            }
          }
          break;
        case "15":
          for (let counter = 0; counter < this.multi.length; counter++) {
            if (this.multi[counter].name.match(level)) {
              this.currTimeSeries = this.multi[counter].series.filter(
                (o, i) => {
                  if (
                    o.name.substr(5, 7).includes("06") ||
                    o.name.substr(5, 7).includes("07") ||
                    o.name.substr(5, 7).includes("08")
                  ) {
                    return o;
                  }
                }
              );
              break;
            }
          }
          break;
        case "16":
          for (let counter = 0; counter < this.multi.length; counter++) {
            if (this.multi[counter].name.match(level)) {
              this.currTimeSeries = this.multi[counter].series.filter(
                (o, i) => {
                  if (
                    o.name.substr(5, 7).includes("09") ||
                    o.name.substr(5, 7).includes("10") ||
                    o.name.substr(5, 7).includes("11")
                  ) {
                    return o;
                  }
                }
              );
              break;
            }
          }
          break;
      }
    } else {
      for (let counter = 0; counter < this.multi.length; counter++) {
        if (this.multi[counter].name.match(level)) {
          this.currTimeSeries = this.multi[counter].series.filter((o, i) => {
            if (month === o.name.substr(5, 7)) {
              return o;
            }
          });
          break;
        }
      }
    }
    this.drawHist();
  }

  public closeHistogram(menu) {
    this.dialogRef.close(menu);
  }
}
