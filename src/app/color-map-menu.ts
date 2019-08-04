import {Component, Inject, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {ColorMap} from './ColorMap';
import {createElement} from '@angular/core/src/view/element';

declare var d3: any;

/**
 * Created by dafre on 6/1/2017.
 */


@Component({
  templateUrl: './color-map-menu.html'
})
export class ColorMapMenu {



  public


  private _colorMapGradient: {
    Name: string,
    IdName: string,
    FullName: string,
    Gradient: {
      Offset: string,
      StopColor: string
    }[]
  }[];

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this._colorMapGradient = data;

    // Draw small preview gradient in menu
    /*var colorMapElement = document.getElementById("colorMapList");
    for (var i = 0; i < this.data.ColorMaps.length; i++) {
      var name = this.data.ColorMaps[i].FullName;
      var colorMap = this.data.ColorMaps[i].ColorMap;
      var e = colorMapElement.childNodes[0].appendChild(document.createElement('li'));
      var w = 20, h = 16;
      var child = e.childNodes[0].appendChild(document.createElement('span'));

      var key = d3.select(child).append("svg").attr("width", w).attr("height", h);
      var gradientId = name.replaceAll(" ", "_").replaceAll("|", "_");
      var legend = key.append("defs").append("svg:linearGradient").attr("id", gradientId)
        .attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "1");//.attr("spreadMethod", "pad");

      for (var currPercentage = 0; currPercentage <= 1.0; currPercentage += 0.05) {
        var offsetString = (currPercentage * 100).toString() + "%";
        var currColors;
        currColors = this.data.customColorMapByPercentage(colorMap, 0.0, 1.0, 1.0 - currPercentage);
        var colorsHex = this.data.rgbToHex(Math.round(currColors[0] * 255),
          Math.round(currColors[1] * 255),
          Math.round(currColors[2] * 255));
        legend.append("stop").attr("offset", offsetString).attr("stop-color", colorsHex).attr("stop-opacity", 1);
      }
      key.append("rect").attr("x", 0).attr("y", 0).attr("width", w - 4).attr("height", h)
        .style("fill", "url(#" + gradientId + ")");//.attr("transform", "translate(0,10)");
    }*/



  }


}
