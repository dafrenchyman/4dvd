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

  buttonDictionary = [
    { colorMapName: "CB Non-Centered", ranges: { min: 0, max: 17 } },
    { colorMapName: "CB Zero-Centered", ranges: { min: 18, max: 35 } },
    { colorMapName: "CB Multi-hue", ranges: { min: 36, max: 59 } },
    { colorMapName: "CB Single-hue", ranges: { min: 60, max: 71 } },
    { colorMapName: "Matlab", ranges: { min: 72, max: 91 } },
    { colorMapName: "Other", ranges: { min: 92, max: 101 } }
  ];

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

  // method to change the range of the ColorMaps via buttons
  changeColorMapSelection(btn) {
    for (let i = 0; i < this.buttonDictionary.length; i++) {
      if (btn === this.buttonDictionary[i].colorMapName) {
        this.min = this.buttonDictionary[i].ranges.min;
        this.max = this.buttonDictionary[i].ranges.max;
      }
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
