import { Component } from "@angular/core";
import { Http } from "@angular/http";
/**
 * Created by dafre on 5/11/2017.
 */

export class ColorMap {
  ColorMaps: Array<{
    FullName: string;
    IdName: string;
    ColorMap: any[];
    Function: string;
    Gradient: Array<{
      Offset: string;
      StopColor: string;
    }>;
  }>;
  ColorMenuItems: { any };
  ColorMenuData: any[];

  // Function comes from slightly modifying:
  // http://stackoverflow.com/questions/18184380/create-a-dynamic-unordered-list-using-a-javascript-function
  /*generateColorMapList (data) {
    var i, item, ref = {}, counts = {};
    function ul() {return document.createElement('ul');}
    function li(element) {
      var e = document.createElement('li');
      if (!element.hasOwnProperty('ColorMap')) {
        e.appendChild(document.createTextNode(element['name']));
      } else {
        e.appendChild(document.createElement('div'));
        e.childNodes[0].setAttribute('ColorMap', element.ColorMap);
        e.childNodes[0].setAttribute('FullName', element.FullName);
        e.childNodes[0].setAttribute('Name', element.Name);

        // Draw small preview gradient in menu
        {
          var w = 20, h = 16;
          var child = e.childNodes[0].appendChild(document.createElement('span'));

          var key = d3.select(child).append("svg").attr("width", w).attr("height", h);
          var gradientId = element.FullName.replaceAll(" ", "_").replaceAll("|", "_");
          var legend = key.append("defs").append("svg:linearGradient").attr("id", gradientId)
            .attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "1");//.attr("spreadMethod", "pad");

          for (var currPercentage = 0; currPercentage <= 1.0; currPercentage += 0.05) {
            var offsetString = (currPercentage * 100).toString() + "%";
            var currColors;
            currColors = this.customColorMapByPercentage(element.ColorMap, 0.0, 1.0, 1.0 - currPercentage);
            var colorsHex = this.rgbToHex(Math.round(currColors[0]*255),
              Math.round(currColors[1]*255),
              Math.round(currColors[2]*255));
            legend.append("stop").attr("offset", offsetString).attr("stop-color", colorsHex).attr("stop-opacity", 1);
          }
          key.append("rect").attr("x", 0).attr("y", 0).attr("width", w-4).attr("height", h)
            .style("fill", "url(#" + gradientId + ")");//.attr("transform", "translate(0,10)");
        }
        e.childNodes[0].appendChild(document.createTextNode(element['name']));
      }
      return e;
    }

    ref[0] = ul();
    ref[0].setAttribute("id", "colormapMenu");
    counts[0] = 1;
    for (i = 0; i < data.length; ++i) {
      var currNode = ref[data[i].parentId].appendChild(li(data[i])); // create <li>
      ref[data[i].id] = ul(); // assume + create <ul>
      //ref[data[i].parentId].appendChild(ref[data[i].id]);
      currNode.appendChild(ref[data[i].id]);
      counts[data[i].id] = 0;
      counts[data[i].parentId] += 1;
    }
    for (i in counts) {// for every <ul>
      if (counts[i] === 0) {// if it never had anything appened to it
        ref[i].parentNode.removeChild(ref[i]); // remove it
        //ref[data[i].id].setAttribute("dbName", data[i].DatabaseStore);
      }
    }
    return ref[0];
  }*/
  RawColorMaps = [];

  colorMaps: {};

  static hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 1].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  hslToRgb(h: number, s: number, l: number) {
    let r;
    let g;
    let b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = ColorMap.hue2rgb(p, q, h + 1 / 3);
      g = ColorMap.hue2rgb(p, q, h);
      b = ColorMap.hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
  }

  componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return (
      "#" +
      this.componentToHex(r) +
      this.componentToHex(g) +
      this.componentToHex(b)
    );
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  rainbowColormapCreator(
    minValue: number,
    maxValue: number,
    currValue: number
  ) {
    const hue =
      240.0 / 360.0 -
      ((currValue - minValue) / (maxValue - minValue)) * (240.0 / 360.0);
    return this.hslToRgb(hue, 1.0, 0.5);
  }

  coolWarmColormap(minValue: number, maxValue: number, currValue: number) {
    const midpoint = [0.865, 0.865, 0.865];
    const valueScaled = (currValue - minValue) / (maxValue - minValue);
    let lowerColor;
    let upperColor;
    let percentFade;
    if (valueScaled < 0.5) {
      lowerColor = [0.32, 0.299, 0.754];
      upperColor = midpoint;
      percentFade = valueScaled / 0.5;
    } else {
      // value Scaled >= 0.5
      lowerColor = midpoint;
      upperColor = [0.706, 0.016, 0.15];
      percentFade = (valueScaled - 0.5) / 0.5;
    }
    let diffRed = upperColor[0] - lowerColor[0];
    let diffGreen = upperColor[1] - lowerColor[1];
    let diffBlue = upperColor[2] - lowerColor[2];

    diffRed = diffRed * percentFade + lowerColor[0];
    diffGreen = diffGreen * percentFade + lowerColor[1];
    diffBlue = diffBlue * percentFade + lowerColor[2];

    return [diffRed, diffGreen, diffBlue];
  }

  coolWarmColormapWithMidpoint(
    minValue: number,
    maxValue: number,
    currValue: number,
    midpointValue: number,
    colorScheme
  ) {
    const midpoint = [0.865, 0.865, 0.865];
    let lowColor;
    let highColor;
    switch (colorScheme) {
      case 1:
        lowColor = [0.32, 0.299, 0.754];
        highColor = [0.706, 0.016, 0.15];
        break;
      case 2:
        lowColor = [0.436, 0.308, 0.631];
        highColor = [0.759, 0.334, 0.046];
        break;
      case 3:
        lowColor = [0.085, 0.532, 0.201];
        highColor = [0.436, 0.308, 0.631];
        break;
      case 4:
        lowColor = [0.217, 0.626, 0.91];
        highColor = [0.677, 0.492, 0.093];
        break;
      case 5:
        lowColor = [0.085, 0.532, 0.201];
        highColor = [0.758, 0.214, 0.233];
        break;
      default:
        lowColor = [0.32, 0.299, 0.754];
        highColor = [0.706, 0.016, 0.15];
        break;
    }

    const valueScaled = (currValue - minValue) / (maxValue - minValue);
    const midpointValueScaled =
      (midpointValue - minValue) / (maxValue - minValue);

    let lowerColor;
    let upperColor;
    let percentFade;
    if (valueScaled < midpointValueScaled) {
      lowerColor = lowColor;
      upperColor = midpoint;
      percentFade = valueScaled / midpointValueScaled;
    } else {
      // value Scaled >= 0.5
      lowerColor = midpoint;
      upperColor = highColor;
      percentFade = (valueScaled - midpointValueScaled) / midpointValueScaled;
    }
    let diffRed = upperColor[0] - lowerColor[0];
    let diffGreen = upperColor[1] - lowerColor[1];
    let diffBlue = upperColor[2] - lowerColor[2];

    diffRed = diffRed * percentFade + lowerColor[0];
    diffGreen = diffGreen * percentFade + lowerColor[1];
    diffBlue = diffBlue * percentFade + lowerColor[2];

    return [diffRed, diffGreen, diffBlue];
  }

  grayscaleColormap(minValue: number, maxValue: number, currValue: number) {
    const valueScaled = (currValue - minValue) / (maxValue - minValue);
    const lowerColor = [1.0, 1.0, 1.0];
    const upperColor = [0.0, 0.0, 0.0];
    const percentFade = valueScaled;

    let diffRed = upperColor[0] - lowerColor[0];
    let diffGreen = upperColor[1] - lowerColor[1];
    let diffBlue = upperColor[2] - lowerColor[2];

    diffRed = diffRed * percentFade + lowerColor[0];
    diffGreen = diffGreen * percentFade + lowerColor[1];
    diffBlue = diffBlue * percentFade + lowerColor[2];

    return [diffRed, diffGreen, diffBlue];
  }

  createColorMapFromHexValues(hexValues) {
    const colorsMap = [];
    let currColor;
    for (let counter = 0; counter < hexValues.length; counter++) {
      currColor = this.hexToRgb(hexValues[counter]);
      colorsMap.push({
        x: counter / (hexValues.length - 1),
        o: 1.0,
        r: currColor.r / 255,
        g: currColor.g / 255,
        b: currColor.b / 255
      });
    }
    return colorsMap;
  }

  createColorMapFromXORGB(xorgb) {
    const colorsMap = [];
    let currColor;
    for (let i = 0; i < xorgb.length; i++) {
      currColor = xorgb[i];
      colorsMap.push({
        x: currColor.x,
        o: currColor.o,
        r: currColor.r,
        g: currColor.g,
        b: currColor.b
      });
    }
    return colorsMap;
  }

  reverseColorMap(colorMap) {
    const colorsMap = [];
    let currColor;
    for (let counter = colorMap.length - 1; counter >= 0; counter--) {
      currColor = colorMap[counter];
      colorsMap.push({
        x: 1 - currColor.x,
        o: currColor.o,
        r: currColor.r,
        g: currColor.g,
        b: currColor.b
      });
    }
    return colorsMap;
  }

  public GetColorMap(colorMapName: any) {
    return this.ColorMaps.filter((obj: any) => obj.FullName === colorMapName)[0]
      .ColorMap;
  }

  GetLocationOfColorMap(fullName) {
    return this.ColorMaps.map((e: any) => e.FullName).indexOf(fullName);
  }

  constructor(colorMaps) {
    this.RawColorMaps = colorMaps;
    this.ColorMaps = [];
    this.createColorMaps();
  }

  createGradient(colorMap) {
    const gradient: Array<{
      Offset: string;
      StopColor: string;
    }> = [];

    for (
      let currPercentage = 0;
      currPercentage <= 1.0;
      currPercentage += 0.05
    ) {
      const offsetString = (currPercentage * 100).toString() + "%";
      let currColors;
      currColors = this.customColorMapByPercentage(
        colorMap,
        0.0,
        1.0,
        1.0 - currPercentage
      );
      const colorsHex = this.rgbToHex(
        Math.round(currColors[0] * 255),
        Math.round(currColors[1] * 255),
        Math.round(currColors[2] * 255)
      );
      gradient.push({
        Offset: offsetString,
        StopColor: colorsHex
      });
    }
    return gradient;
  }

  createColorMaps() {
    // Load Color Maps from json "RawColorMaps"
    for (let i = 0; i < this.RawColorMaps.length; i++) {
      const curr = this.RawColorMaps[i];
      let currColorMap;
      if (curr.BuildFunction === "HEX") {
        currColorMap = this.createColorMapFromHexValues(curr.Values);
      } else if (curr.BuildFunction === "xorgb") {
        currColorMap = this.createColorMapFromXORGB(curr.Values);
      }

      const idName = curr.FullName.replace(/\|/g, "_").replace(/ /g, "_");
      const gradient = this.createGradient(currColorMap);
      this.ColorMaps.push({
        FullName: curr.FullName,
        IdName: idName,
        ColorMap: currColorMap,
        Function: curr.Function,
        Gradient: gradient
      });
      const reverseColorMap = this.reverseColorMap(currColorMap);
      const reverseGradient = this.createGradient(reverseColorMap);
      this.ColorMaps.push({
        FullName: curr.FullName + " Inverse",
        IdName: idName + "_Inverse",
        ColorMap: reverseColorMap,
        Function: curr.Function,
        Gradient: reverseGradient
      });
    }

    // Rainbow Colormap
    {
      const rainbowColormap = [];
      for (
        let currPercentage = 0.0;
        currPercentage < 1.01;
        currPercentage += 0.01
      ) {
        const currValue = this.rainbowColormapCreator(0.0, 1.0, currPercentage);
        const r = currValue[0];
        const g = currValue[1];
        const b = currValue[2];
        rainbowColormap.push({ x: currPercentage, o: 1.0, r, g, b });
      }
      this.ColorMaps.push({
        FullName: "Other|Rainbow",
        IdName: "Other_Rainbow",
        ColorMap: rainbowColormap,
        Function: "customColorMap",
        Gradient: this.createGradient(rainbowColormap)
      });
      this.ColorMaps.push({
        FullName: "Other|Rainbow Inverse",
        IdName: "Other_Rainbow_Inverse",
        ColorMap: this.reverseColorMap(rainbowColormap),
        Function: "customColorMap",
        Gradient: this.createGradient(rainbowColormap)
      });
    }

    // All these color maps came from: http://www.paraview.org/ParaView3/index.php/Default_Color_Map
    {
      // Blackbody Radiation
      // Cool to Warm
      // Gray Scale
      // Spatial Contrast
    }

    // Resort the colormap alphabetically
    this.ColorMaps.sort((a, b) => {
      const x = a.FullName < b.FullName ? -1 : 1;
      return x;
    });

    // Organize the structure into something "nice" so we can load it properly
    if (false) {
      /*var currId = 0;
      this.ColorMenuItems.id = 0;
      for (var counter = 0; counter < this.ColorMaps.length; counter++) {
        var datasetStructure = this.ColorMaps[counter].FullName.split("|");
        var currStructure = datasetStructure;
        var currMenu = this.ColorMenuItems;
        var parentId = 0;

        for (var structCounter = 0; structCounter < currStructure.length; structCounter++) {
          var currProperty = currStructure[structCounter];
          if (!currMenu.hasOwnProperty(currProperty)) {
            currMenu[currProperty] = {};
            currMenu[currProperty].id = ++currId;
            currMenu[currProperty].parentId = parentId;
            if (structCounter === currStructure.length - 1) {
              this.ColorMenuData.push({
                id: currId,
                parentId: parentId,
                name: currProperty,
                FullName: this.ColorMaps[counter].FullName,
                ColorMap: this.ColorMaps[counter].ColorMap,
                Function: this.ColorMaps[counter].Function
              });
            } else {
              this.ColorMenuData.push({
                id: currId,
                parentId: parentId,
                name: currProperty
              });
            }
          }
          parentId = currMenu[currProperty].id;
          currMenu = currMenu[currProperty];
        }
      }
      */
    }

    // return this.colorMaps;
  }

  customColorMap(colormap, minValue, maxValue, currValue) {
    const valueScaled = (currValue - minValue) / (maxValue - minValue);
    let lowerColor;
    let upperColor;
    let percentFade;
    if (currValue < minValue) {
      lowerColor = [colormap[0].r, colormap[0].g, colormap[0].b];
      upperColor = [colormap[0].r, colormap[0].g, colormap[0].b];
      percentFade = 1.0;
    } else if (currValue > maxValue) {
      const curLoc = colormap.length - 1;
      lowerColor = [colormap[curLoc].r, colormap[curLoc].g, colormap[curLoc].b];
      upperColor = [colormap[curLoc].r, colormap[curLoc].g, colormap[curLoc].b];
      percentFade = 1.0;
    } else {
      for (let i = 1; i < colormap.length; i++) {
        if (valueScaled >= colormap[i - 1].x && valueScaled <= colormap[i].x) {
          lowerColor = [
            colormap[i - 1].r,
            colormap[i - 1].g,
            colormap[i - 1].b
          ];
          upperColor = [colormap[i].r, colormap[i].g, colormap[i].b];
          percentFade =
            (valueScaled - colormap[i - 1].x) /
            (colormap[i].x - colormap[i - 1].x);
          break;
        } else if (i === colormap.length - 1 && valueScaled > colormap[i].x) {
          break;
        }
      }
    }

    let diffRed = upperColor[0] - lowerColor[0];
    let diffGreen = upperColor[1] - lowerColor[1];
    let diffBlue = upperColor[2] - lowerColor[2];

    diffRed = diffRed * percentFade + lowerColor[0];
    diffGreen = diffGreen * percentFade + lowerColor[1];
    diffBlue = diffBlue * percentFade + lowerColor[2];

    return [diffRed, diffGreen, diffBlue];
  }

  customColorMapWithMidpoint(
    colormap,
    minValue,
    midpoint,
    maxValue,
    currValue
  ) {
    let valueScaled;
    let lowerColor;
    let upperColor;
    let percentFade;
    if (currValue < midpoint) {
      valueScaled = (currValue - minValue) / (midpoint - minValue) / 2.0;
    } else if (currValue > midpoint) {
      valueScaled = (currValue - midpoint) / (maxValue - midpoint) / 2.0 + 0.5;
    } else {
      valueScaled = 0.5;
    }

    if (currValue < minValue) {
      lowerColor = [colormap[0].r, colormap[0].g, colormap[0].b];
      upperColor = [colormap[0].r, colormap[0].g, colormap[0].b];
      percentFade = 1.0;
    } else if (currValue > maxValue) {
      const curLoc = colormap.length - 1;
      lowerColor = [colormap[curLoc].r, colormap[curLoc].g, colormap[curLoc].b];
      upperColor = [colormap[curLoc].r, colormap[curLoc].g, colormap[curLoc].b];
      percentFade = 1.0;
    } else {
      for (let i = 1; i < colormap.length; i++) {
        if (valueScaled >= colormap[i - 1].x && valueScaled <= colormap[i].x) {
          lowerColor = [
            colormap[i - 1].r,
            colormap[i - 1].g,
            colormap[i - 1].b
          ];
          upperColor = [colormap[i].r, colormap[i].g, colormap[i].b];
          percentFade =
            (valueScaled - colormap[i - 1].x) /
            (colormap[i].x - colormap[i - 1].x);
        }
      }
    }
    let diffRed = upperColor[0] - lowerColor[0];
    let diffGreen = upperColor[1] - lowerColor[1];
    let diffBlue = upperColor[2] - lowerColor[2];

    diffRed = diffRed * percentFade + lowerColor[0];
    diffGreen = diffGreen * percentFade + lowerColor[1];
    diffBlue = diffBlue * percentFade + lowerColor[2];

    return [diffRed, diffGreen, diffBlue, 1.0];
  }

  customColorMapWithMidpointByPercentage(
    colormap,
    minValue,
    midpoint,
    maxValue,
    percentage
  ) {
    const currValue = (maxValue - minValue) * percentage + minValue;
    return this.customColorMapWithMidpoint(
      colormap,
      minValue,
      midpoint,
      maxValue,
      currValue
    );
  }

  customColorMapByPercentage(colormap, minValue, maxValue, percentage) {
    const currValue = (maxValue - minValue) * percentage + minValue;
    return this.customColorMap(colormap, minValue, maxValue, currValue);
  }

  // tslint:disable:max-line-length
  /*drawLegend (Settings) {
    var w = 140, h = 400;

    d3.select("#legend").selectAll("svg").remove();
    var key = d3.select("#legend").append("svg").attr("width", w).attr("height", h);

    var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "100%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

    var colorMap = this.GetColorMap(Settings.displaySettings.currColormapName);

    for (var currPercentage = 0; currPercentage <= 1.0; currPercentage += 0.05)
    {
      var offsetString = (currPercentage * 100).toString() + "%";
      var currColors;
      if (Settings.displaySettings.functionForColorMap == "customColorMap") {
        currColors = this.customColorMapByPercentage(colorMap, 0.0, 1.0, 1.0 - currPercentage);
      } else if (Settings.displaySettings.functionForColorMap == "customColorMapWithMidpoint") {
        currColors = this.customColorMapWithMidpointByPercentage(colorMap, parseFloat(Settings.LayerSettings.minValue), 0.0, parseFloat(Settings.LayerSettings.maxValue), 1.0 - currPercentage);
      }

      var colorsHex = this.rgbToHex(Math.round(currColors[0]*255),
        Math.round(currColors[1]*255),
        Math.round(currColors[2]*255));
      legend.append("stop").attr("offset", offsetString).attr("stop-color", colorsHex).attr("stop-opacity", 1);
    }

    //legend.append("stop").attr("offset", "100%").attr("stop-color", "#FEE8c8").attr("stop-opacity", 1);

    key.append("rect").attr("width", w - 100).attr("height", h - 100).style("fill", "url(#gradient)").attr("transform", "translate(0,10)");

    var y = d3.scale.linear().range([300, 0]).domain([Settings.LayerSettings.minValue, Settings.LayerSettings.maxValue]);

    var yAxis = d3.svg.axis().scale(y).orient("right");
    //yAxis.style("color", "white");

    key.append("g").attr("class", "y axis").attr("transform", "translate(41,10)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 50).attr("dy", ".71em").style("text-anchor", "end").text("Temperature (" + Settings.LayerSettings.TemperatureSymbol + ")");
  }*/
}
