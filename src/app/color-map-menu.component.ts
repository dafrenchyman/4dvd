import { Component, Inject, ViewChild } from "@angular/core";
import { createElement } from "@angular/core/src/view/element";
import { MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material/dialog";
import { ColorMap } from "./ColorMap";

declare var d3: any;

/**
 * Created by dafre on 6/1/2017.
 */

@Component({
  templateUrl: "./color-map-menu.component.html"
})
export class ColorMapMenuComponent {
  public _colorMapGradient: Array<{
    ColorMaps: ColorMap;
    IdName: string;
    FullName: string;
    Gradient: Array<{
      Offset: string;
      StopColor: string;
    }>;
  }>;

  min = 0;
  max = 17;
  inverse = false;

  // closes color map menu
  closeColorMaps() {
    this.dialogRef.close();
  }

  // checks if the current index is the inverse version. Displays depending on the state of the inverse switch
  indexSkip(num) {
    if (this.inverse) {
      if (num % 2 === 1) {
        return true;
      }
    } else {
      if (num % 2 === 0) {
        return true;
      }
    }
    return false;
  }

  // inverse switch
  toggleInverseMaps() {
    this.inverse ? (this.inverse = false) : (this.inverse = true);
  }

  // method to change the range of the ColorMap for loop
  changeColors(btn) {
    if (btn === 0) {
      this.min = 0;
      this.max = 17;
    } else if (btn === 1) {
      this.min = 18;
      this.max = 35;
    } else if (btn === 2) {
      this.min = 36;
      this.max = 59;
    } else if (btn === 3) {
      this.min = 60;
      this.max = 71;
    } else if (btn === 4) {
      this.min = 72;
      this.max = 91;
    } else if (btn === 5) {
      this.min = 92;
      this.max = 101;
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ColorMapMenuComponent>
  ) {
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
