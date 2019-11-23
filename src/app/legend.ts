/**
 * Created by dafre on 7/13/2017.
 */

import { ColorMap } from "./ColorMap";
import { Settings } from "./settings";

declare var d3: any;

export class Legend {
  private _settings: Settings;
  private _colorMap: ColorMap;

  public constructor(colorMap: ColorMap, settings: Settings) {
    this._settings = settings;
    this._colorMap = colorMap;
  }

  public drawLegend() {
    const w = 140;
    const h = 400;
    const colorMap = this._colorMap.GetColorMap(
      this._settings.currColormapName
    );

    d3.select("#Legend")
      .selectAll("svg")
      .remove();
    const key = d3
      .select("#Legend")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    // tslint:disable:max-line-length
    const legend = key
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    for (
      let currPercentage = 0;
      currPercentage <= 1.0;
      currPercentage += 0.05
    ) {
      const offsetString = (currPercentage * 100).toString() + "%";
      let currColors;
      if (this._settings.functionForColorMap === "customColorMap") {
        currColors = this._colorMap.customColorMapByPercentage(
          colorMap,
          0.0,
          1.0,
          1.0 - currPercentage
        );
      } else if (
        this._settings.functionForColorMap === "customColorMapWithMidpoint"
      ) {
        currColors = this._colorMap.customColorMapWithMidpointByPercentage(
          colorMap,
          this._settings.minValue,
          0.0,
          this._settings.maxValue,
          1.0 - currPercentage
        );
      }

      const colorsHex = this._colorMap.rgbToHex(
        Math.round(currColors[0] * 255),
        Math.round(currColors[1] * 255),
        Math.round(currColors[2] * 255)
      );
      legend
        .append("stop")
        .attr("offset", offsetString)
        .attr("stop-color", colorsHex)
        .attr("stop-opacity", 1);
    }
    key
      .append("rect")
      .attr("width", w - 100)
      .attr("height", h - 100)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");

    const y = d3
      .scaleLinear()
      .range([300, 0])
      .domain([this._settings.minValue, this._settings.maxValue]);
    const yAxis = d3.axisRight(y);

    // Get the units type
    let legendUnits = "";
    switch (this._settings.DataUnits) {
      case "Kelvins":
      case "degK":
        switch (this._settings.TemperatureType) {
          case "C":
            legendUnits =
              "Temperature (" + this._settings.TemperatureSymbol + ")";
            break;
          default:
            legendUnits = this._settings.DataUnits;
        }
        break;
      default:
        legendUnits = this._settings.DataUnits;
    }

    // Create the legend label
    key
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(41,10)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(legendUnits);
  }
}
