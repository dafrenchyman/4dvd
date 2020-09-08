import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatDialog,
  MatDialogRef
} from "@angular/material";
import { Model } from "./model";
import { TimeseriesData } from "./timeseriesData";

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
    this.currTimeSeries = this.multi[0].series;
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
    const margin = { top: 50, right: 50, bottom: 100, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    //Set the margins for the chart
    const svg = d3
      .select("#hist_div")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setting the x-axis using the range of values
    const x = d3
      .scaleLinear()
      .domain(d3.extent(this.currTimeSeries.map(o => o.value))) 
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Setting the x-axis label  
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom / 2)
      .attr("class", "text-label")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(this.title);

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
    const yAxis = svg.append("g")
                  .transition()
                  .duration(1000)
                  .call(d3.axisLeft(y));

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
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => height - y(d.length))
      .style("fill", "#1f78b4");

    u.exit().remove();
  }

  public UpdateHist(event) {
    d3.selectAll("#hist_div > *").remove();
    this.nBin = event.target.value;
    this.drawHist();
  }

  public UpdateLevel(value) {
    d3.selectAll("#hist_div > *").remove();
    this.currTimeSeries = [];
    for (let counter = 0; counter < this.multi.length; counter++) {
      if (this.multi[counter].name.match(value)) {
        this.currTimeSeries = this.multi[counter].series;
        break;
      }
    }
    this.drawHist();
  }

  public closeHistogram() {
    this.dialogRef.close();
  }
}
