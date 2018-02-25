/**
 * Created by dafre on 7/13/2017.
 */

import {Settings} from "./settings";
import {ColorMap} from "./ColorMap";

declare var d3: any;

export class Legend {

  private _settings : Settings;
  private _colorMap : ColorMap;

  public constructor(colorMap : ColorMap, settings : Settings) {
    this._settings = settings;
    this._colorMap = colorMap;
  }

  public drawLegend() {
    var w = 140, h = 400;
    var colorMap = this._colorMap.GetColorMap(this._settings.currColormapName);

    d3.select("#Legend").selectAll("svg").remove();
    var key = d3.select("#Legend").append("svg").attr("width", w).attr("height", h);
    var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "100%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

    for (var currPercentage = 0; currPercentage <= 1.0; currPercentage += 0.05) {
      var offsetString = (currPercentage * 100).toString() + "%";
      var currColors;
      if (this._settings.functionForColorMap == "customColorMap") {
        currColors = this._colorMap.customColorMapByPercentage(colorMap, 0.0, 1.0, 1.0 - currPercentage);
      } else if (this._settings.functionForColorMap == "customColorMapWithMidpoint") {
        currColors = this._colorMap.customColorMapWithMidpointByPercentage(colorMap
          , this._settings.minValue, 0.0
          , this._settings.maxValue, 1.0 - currPercentage);
      }

      var colorsHex = this._colorMap.rgbToHex(Math.round(currColors[0] * 255),
        Math.round(currColors[1] * 255),
        Math.round(currColors[2] * 255));
      legend.append("stop").attr("offset", offsetString).attr("stop-color", colorsHex).attr("stop-opacity", 1);
    }
    key.append("rect").attr("width", w - 100).attr("height", h - 100).style("fill", "url(#gradient)").attr("transform", "translate(0,10)");

    var y = d3.scaleLinear().range([300, 0]).domain([this._settings.minValue, this._settings.maxValue]);
    var yAxis = d3.axisRight(y);

    key.append("g").attr("class", "y axis").attr("transform", "translate(41,10)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 50).attr("dy", ".71em").style("text-anchor", "end").text("Temperature (" + this._settings.TemperatureSymbol + ")");
  }
}
