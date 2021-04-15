import { Helpers } from "./helpers";
/**
 * Created by dafre on 5/11/2017.
 */

declare var jQuery: any;

declare var URI: any;

import { GlMatrix } from "./GlMatrix";
import { GlobeViewType, Settings } from "./settings";

export class UI {
  mouseDown: boolean;
  MouseDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
  inMenu: boolean;

  xMovement: number;
  yMovement: number;
  zoomLevel: number;
  globeDistance: number;

  MenuOptions: any;

  private _settings: Settings;

  MenuItems: {};
  MenuData: any[];

  constructor(settings: Settings, menuOptions) {
    this._settings = settings;
    this.MenuOptions = menuOptions;

    this.mouseDown = false;
    this.MouseDragging = false;
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.inMenu = false;

    this.xMovement = 0;
    this.yMovement = 0;
    this.zoomLevel = -165;
    this.globeDistance = -250.0;
  }

  resizeFunction() {}
  handleMouseDown(event) {
    event.preventDefault();
    this.mouseDown = true;
    if (event.type === "mousedown") {
      // && displaySettings.globeView)
      this.lastMouseX = event.clientX; // + event.touches[0].clientX;
      this.lastMouseY = event.clientY; // + event.touches[0].clientY;
    } else if (event.type === "touchstart") {
      const touch = event.touches[0] || event.changedTouches[0];
      this.lastMouseX = touch.pageX;
      this.lastMouseY = touch.pageY;
    }
  }

  handleMouseMove(Gl, globeView: GlobeViewType, event) {
    event.preventDefault();
    if (this.mouseDown) {
      if (
        event.clientX !== this.lastMouseX &&
        event.clientY !== this.lastMouseY
      ) {
        this.MouseDragging = true;
      }
    }
    if (!this.mouseDown) {
      this.MouseDragging = false;
      return Gl;
    }

    let newX = null;
    let newY = null;

    if (event.type === "mousemove") {
      newX = event.clientX; // + event.touches[0].clientX;
      newY = event.clientY; // + event.touches[0].clientY;
    } else if (event.type === "touchmove") {
      event.preventDefault();
      const touch = event.touches[0] || event.changedTouches[0];
      newX = touch.pageX;
      newY = touch.pageY;
    }

    if (
      globeView === GlobeViewType.ThreeDim ||
      globeView === GlobeViewType.Ortho
    ) {
      // TODO: Need to come up a "real" formula for scaling the rotation speed upon different zoom levels.
      const scale =
        this.zoomLevel <= 0 ? 10 : (this.zoomLevel - this.globeDistance) / 10;
      // Lon Rotation
      const deltaX = newX - this.lastMouseX;
      const newRotationMatrix_x = GlMatrix.mat4.create();
      GlMatrix.mat4.identity(newRotationMatrix_x);
      GlMatrix.mat4.rotate(
        newRotationMatrix_x,
        newRotationMatrix_x,
        Helpers.degToRad(deltaX / scale),
        [0, 1, 0]
      );
      GlMatrix.mat4.multiply(
        Gl.earthRotationMatrix_x,
        newRotationMatrix_x,
        Gl.earthRotationMatrix_x
      );

      // Lat Rotation
      const deltaY = newY - this.lastMouseY;
      const newRotationMatrix_y = GlMatrix.mat4.create();
      GlMatrix.mat4.identity(newRotationMatrix_y);

      GlMatrix.mat4.rotate(
        newRotationMatrix_y,
        newRotationMatrix_y,
        Helpers.degToRad(deltaY / scale),
        [1, 0, 0]
      );
      GlMatrix.mat4.multiply(
        Gl.earthRotationMatrix_y,
        newRotationMatrix_y,
        Gl.earthRotationMatrix_y
      );

      // Combine the two rotations (we must keep them seperate to make sure we don't "tilt" the axis
      GlMatrix.mat4.multiply(
        Gl.earthRotationMatrix,
        Gl.earthRotationMatrix_y,
        Gl.earthRotationMatrix_x
      );
      this.lastMouseX = newX;
      this.lastMouseY = newY;
    } else {
      // TODO: Need to come up a "real" formula for scaling the rotation speed upon different zoom levels.
      const scale = this.zoomLevel <= 0 ? 10 : this.zoomLevel / 2;
      // Lon Rotation
      const deltaX = (1.0 * (newX - this.lastMouseX)) / scale;
      const deltaY = (-1.0 * (newY - this.lastMouseY)) / scale;
      // var newRotationMatrix_x = mat4.create();

      this.xMovement = this.xMovement + deltaX;
      this.yMovement = this.yMovement + deltaY;

      // mat4.scalar.translate(earthRotationMatrix, [deltaX/scale, deltaY/scale, 0], earthRotationMatrix);
      // mat4.identity(newRotationMatrix_x);

      // mat4.multiply(earthRotationMatrix_x, newRotationMatrix_x, earthRotationMatrix_x);

      // Lat Rotation
      /*var deltaY = newY - lastMouseY;
       var newRotationMatrix_y = mat4.create();
       mat4.identity(newRotationMatrix_y);

       mat4.rotate(newRotationMatrix_y, newRotationMatrix_y, degToRad(deltaY / scale), [1, 0, 0]);
       mat4.multiply(earthRotationMatrix_y, newRotationMatrix_y, earthRotationMatrix_y);

       // Combine the two rotations (we must keep them seperate to make sure we don't "tilt" the axis
       mat4.multiply(earthRotationMatrix, earthRotationMatrix_y, earthRotationMatrix_x);*/
      this.lastMouseX = newX;
      this.lastMouseY = newY;
    }
    return Gl;
  }

  handleMouseUp(
    World,
    Gl: WebGLRenderingContext,
    globeView: GlobeViewType,
    pMatrix,
    mvMatrix,
    vMatrix,
    earthRotationMatrix,
    earthRotationMatrix_x,
    earthRotationMatrix_y,
    event
  ): boolean {
    const canvas = jQuery("#ClimateGl")[0];
    this.mouseDown = false;
    if (!this.MouseDragging && !this.inMenu) {
      // && document.getElementById("canvas-align").style.display == "block"
      // Need to reproject the canvas (x,y) into a "ray" going through the "world"
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // mat4.inverse(vMatrix, vMatrix);

      const widthToHeight = Gl.canvas.width / Gl.canvas.height;

      // Calculate click projection (for Unproject to work, needs to be negative farfield)
      // TODO: Need to correct the Unproject to work for positive far field, so this section could be skipped
      if (globeView === GlobeViewType.Ortho) {
        const orthoZoom = (-1 * this.zoomLevel) / (80.0 * 2.0);
        GlMatrix.mat4.ortho(
          pMatrix,
          -widthToHeight * 80 * orthoZoom,
          widthToHeight * 80 * orthoZoom,
          -1 * 80 * orthoZoom,
          1 * 80 * orthoZoom,
          1000,
          -1000.0
        );
        GlMatrix.mat4.identity(mvMatrix);
        GlMatrix.mat4.translate(mvMatrix, mvMatrix, [
          this.xMovement,
          this.yMovement,
          this.globeDistance + this.zoomLevel
        ]);
        GlMatrix.mat4.multiply(mvMatrix, mvMatrix, earthRotationMatrix);
        GlMatrix.mat4.rotate(mvMatrix, mvMatrix, Helpers.degToRad(-90), [
          1,
          0,
          0
        ]);
        GlMatrix.mat4.copy(vMatrix, mvMatrix);
      }

      const vec1 = Helpers.Unproject(
        x,
        y,
        0,
        Gl.canvas.width,
        Gl.canvas.height,
        pMatrix,
        vMatrix
      );
      const vec2 = Helpers.Unproject(
        x,
        y,
        1,
        Gl.canvas.width,
        Gl.canvas.height,
        pMatrix,
        vMatrix
      );

      // Origin vector as vec3
      const origin = GlMatrix.vec3.create();
      origin[0] = vec1[0];
      origin[1] = vec1[1];
      origin[2] = vec1[2];

      // Direction vector as vec3
      const direction = GlMatrix.vec3.create();
      direction[0] = vec2[0];
      direction[1] = vec2[1];
      direction[2] = vec2[2];

      const points = [];
      points.push(vec1);
      points.push(vec2);

      // lineSegmentBuffers(points);

      // Loop through all of the Triangles that make up the sphere to find which triangles the "ray" intersects with
      const intersectionPoints = [];
      let triangleCounter = 0;
      if (World.hasOwnProperty("SphereTriangles")) {
        while (triangleCounter < World.SphereTriangles.length) {
          const v0 = World.SphereTriangles[triangleCounter++];
          const v1 = World.SphereTriangles[triangleCounter++];
          const v2 = World.SphereTriangles[triangleCounter++];

          const calc = Helpers.TriangleIntersection(
            v0,
            v1,
            v2,
            direction,
            origin
          );
          if (calc.intersects) {
            intersectionPoints.push(calc.point);
          }
        }

        // Calculate which intersection is closest to the camera (we can have two intersections on either side of the globe).
        // Need the one facing the camera
        let maxDistance = 10000;
        let bestPoint = GlMatrix.vec3.create();
        for (const intersectionPoint of intersectionPoints) {
          const currDistance = GlMatrix.vec3.dist(intersectionPoint, direction);
          if (currDistance < maxDistance) {
            maxDistance = currDistance;
            bestPoint = intersectionPoint;
          }
        }
        /*for (
          let intersectionCounter = 0;
          intersectionCounter < intersectionPoints.length;
          intersectionCounter++
        ) {
          const currDistance = GlMatrix.vec3.dist(
            intersectionPoints[intersectionCounter],
            direction
          );
          if (currDistance < maxDistance) {
            maxDistance = currDistance;
            bestPoint = intersectionPoints[intersectionCounter];
          }
        }*/

        // Now that we have the coordinates of where the user clicked, find the nearest gridbox
        maxDistance = 10000;
        let bestGridBox = -1;
        if (GlMatrix.vec3.dist(bestPoint, GlMatrix.vec3.create()) > 0) {
          for (
            let gridBoxCounter = 0;
            gridBoxCounter < World.GridBoxData.length;
            gridBoxCounter++
          ) {
            const currDistance = GlMatrix.vec3.dist(
              bestPoint,
              World.GridBoxData[gridBoxCounter].point
            );
            if (currDistance < maxDistance) {
              maxDistance = currDistance;
              bestGridBox = gridBoxCounter;
            }
          }
        }

        // If we found a gridbox (if we clicked off of the globe, we wouldn't have found one, update the selected gridbox
        if (bestGridBox > -1) {
          const gridBox_Id = World.GridBoxData[bestGridBox].gridBox;
          const lat = World.GridBoxData[bestGridBox].lat;
          const lon = World.GridBoxData[bestGridBox].lon;
          const value = World.GridBoxData[bestGridBox].anomaly;
          this._settings.CurrGridBoxId = gridBox_Id;
          this._settings.CurrGridBoxLat = lat;
          this._settings.CurrGridBoxLon = lon;
          this._settings.CurrGridBoxValue = value;
          return true;
          // jQuery( "#slider_year" ).slider(y) );
          // 				LoadTimeseriesData(LayerSettings);

          /*jQuery("div#divGridLat").text(lat);
           jQuery("div#divGridLon").text(lon);
           jQuery("div#divGridValue").text(value);
           jQuery("div#divGridLat2").text(lat);
           jQuery("div#divGridLon2").text(lon);*/

          // window.alert("Nearest gridbox location is lat: " + lat + ", lon: " + lon + " for ID#: " + gridBox_Id);
          // document.getElementById("timeSeriesButton1").style.display = "block";
          // document.getElementById("gridBoxSize").style.display = "block";
          // jQuery("div#divGridValue").style.display = "block";
        } else {
          this._settings.CurrGridBoxId = -1;
          this._settings.CurrGridBoxLat = null;
          this._settings.CurrGridBoxLon = null;
          this._settings.CurrGridBoxValue = null;
          return false;
          // document.getElementById("gridBoxSize").style.display = "none";
        }
      }
    }

    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("rMatrix");
      uri.removeSearch("rMatrixX");
      uri.removeSearch("rMatrixY");
      uri.removeSearch("xMov");
      uri.removeSearch("yMov");
      uri.addSearch("rMatrix", earthRotationMatrix);
      uri.addSearch("rMatrixX", earthRotationMatrix_x);
      uri.addSearch("rMatrixY", earthRotationMatrix_y);
      uri.addSearch("xMov", this.xMovement);
      uri.addSearch("yMov", this.yMovement);
      window.history.replaceState("", "", uri.search());
    }
  }

  handleMouseWheel(globeView: GlobeViewType, event) {
    event.preventDefault();
    let maxZoom = -75;
    if (
      globeView === GlobeViewType.ThreeDim ||
      globeView === GlobeViewType.Ortho
    ) {
      maxZoom = 2;
    }

    {
      this.zoomLevel = this.zoomLevel + -event.deltaY / 20;
      const currZoom =
        -this.globeDistance - this._settings.EarthRadius - maxZoom;
      if (globeView === GlobeViewType.Ortho) {
        if (this.zoomLevel > -5) {
          this.zoomLevel = -5;
          if (this.zoomLevel < this.globeDistance * 2) {
            this.zoomLevel = this.globeDistance * 2;
          }
        }
      } else {
        if (this.zoomLevel > currZoom) {
          this.zoomLevel = currZoom;
        }
        if (this.zoomLevel < this.globeDistance * 2) {
          this.zoomLevel = this.globeDistance * 2;
        }
      }
    }

    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("zoom");
      uri.addSearch("zoom", this.zoomLevel);
      window.history.replaceState("", "", uri.search());
    }
  }

  GetMenuOption(menuOption, y) {
    for (let counter = 0; counter < menuOption.values.length; counter++) {
      if (menuOption.values[counter].option === y) {
        return menuOption.values[counter];
      }
    }
    return null;
  }

  ChangeMenuOption(y, menuOption, callbackNow, callbackFunc) {
    // Get values from uri
    // var uri = new URI(window.location.href);
    let scriptToLoad = jQuery.Deferred();
    scriptToLoad.resolve();
    const menu = this.GetMenuOption(menuOption, y);
    const filename = menu.file;
    if (filename.length > 0) {
      scriptToLoad = jQuery.getScript(filename);
    }
    if (callbackNow === true) {
      jQuery.when(scriptToLoad).done(() => {
        callbackFunc();
      });
    }
    return scriptToLoad;
  }

  // Radio button options
  ChangeBumpMapping(Gl, y) {
    const menuOption = this.GetMenuOption(this.MenuOptions.BumpMapping, y);
    if (menuOption.file.length > 0) {
      this._settings.lightingEnabled = true;
      Gl.initTextures(menuOption.file);
    } else {
      this._settings.lightingEnabled = false;
    }
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("bumpMapping");
      uri.addSearch("bumpMapping", y);
      window.history.replaceState("", "", uri.search());
    }
  }

  GlobeViewSettings(Gl, y, resetView) {
    switch (y) {
      case "3d":
        this._settings.globeView = GlobeViewType.ThreeDim;
        if (resetView) {
          this.xMovement = 0;
          this.yMovement = 0;
          this.zoomLevel = 80;
        }
        break;
      case "ortho":
        this._settings.globeView = GlobeViewType.Ortho;
        if (resetView) {
          this.xMovement = 0;
          this.yMovement = 0;
          this.zoomLevel = -165;
        }
        break;
      case "2d":
        this._settings.globeView = GlobeViewType.TwoDim;
        if (resetView) {
          GlMatrix.mat4.identity(Gl.earthRotationMatrix);
          GlMatrix.mat4.identity(Gl.earthRotationMatrix_x);
          GlMatrix.mat4.identity(Gl.earthRotationMatrix_y);
          this.xMovement = 0;
          this.yMovement = 0;
          this.zoomLevel = 70;
        }
        break;
      default:
        break;
    }
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("zoom");
      uri.removeSearch("rMatrix");
      uri.removeSearch("rMatrixX");
      uri.removeSearch("rMatrixY");
      uri.removeSearch("xMov");
      uri.removeSearch("yMov");
      uri.addSearch("zoom", this.zoomLevel);
      uri.addSearch("rMatrix", Gl.earthRotationMatrix);
      uri.addSearch("rMatrixX", Gl.earthRotationMatrix_x);
      uri.addSearch("rMatrixY", Gl.earthRotationMatrix_y);
      uri.addSearch("xMov", this.xMovement);
      uri.addSearch("yMov", this.yMovement);
      window.history.replaceState("", "", uri.search());
    }
  }

  ChangeGlobeViewMenu(Gl, y) {
    // Change the setting
    this.GlobeViewSettings(Gl, y, true);
    this._settings.globeView = y;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("globe");
      uri.addSearch("globe", y);
      window.history.replaceState("", "", uri.search());
    }

    // Change the viewport
    return this.ChangeMenuOption(y, this.MenuOptions.Globe, true, () => {
      Gl.initBuffers();
    });
  }

  ChangeRiversMenu(Lines, y) {
    // Change the setting
    this._settings.RiversType = y;
    this._settings.rivers = y === "" ? false : true;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("rivers");
      uri.addSearch("rivers", y);
      window.history.replaceState("", "", uri.search());
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.Rivers, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeCoastsMenu(Lines, y) {
    // Change the setting
    this._settings.CoastsType = y;
    this._settings.coasts = y === "" ? false : true;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("coasts");
      uri.addSearch("coasts", y);
      window.history.replaceState("", "", uri.search());
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.Coasts, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeLakesMenu(Lines, y) {
    // Change the setting
    this._settings.LakesType = y;
    this._settings.lakes = y === "" ? false : true;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("lakes");
      uri.addSearch("lakes", y);
      window.history.replaceState("", "", uri.search());
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.Lakes, true, () => {
      Lines.lineBuffers();
    });
  }

  // Toggle button options
  ChangeMinorIslandsMenu(Lines, y) {
    // Change the settings
    // const y = jQuery("#" + this.MenuOptions.MinorIslands.id)[0].checked;
    this._settings.minorIslands = y === true ? true : false;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      if (y === true) {
        uri.removeSearch("minorIslands");
        uri.addSearch("minorIslands", true);
        window.history.replaceState("", "", uri.search());
      } else {
        uri.removeSearch("minorIslands");
        uri.addSearch("minorIslands", false);
        window.history.replaceState("", "", uri.search());
      }
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.MinorIslands, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeTimeZonesMenu(Lines, y) {
    // Change the setting
    // const y = jQuery("#" + this.MenuOptions.TimeZone.id)[0].checked;
    this._settings.timeZones = y === true ? true : false;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      if (y === true) {
        uri.removeSearch("timeZones");
        uri.addSearch("timeZones", true);
        window.history.replaceState("", "", uri.search());
      } else {
        uri.removeSearch("timeZones");
        uri.addSearch("timeZones", false);
        window.history.replaceState("", "", uri.search());
      }
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.TimeZone, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeGeoLinesMenu(Lines, y) {
    // Change the settings
    // const y = jQuery("#" + this.MenuOptions.GeoLines.id)[0].checked;
    this._settings.geoLines = y === true ? true : false;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("geoLines");
      if (y === true) {
        uri.addSearch("geoLines", true);
      } else {
        uri.addSearch("geoLines", false);
      }
      window.history.replaceState("", "", uri.search());
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.GeoLines, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeLatLonMenu(Lines, y) {
    // Change the settings
    // const y = jQuery("#" + this.MenuOptions.LatLon.id)[0].checked;
    this._settings.latLons = y === true ? true : false;

    // Change the URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("latlon");
      if (y === true) {
        uri.addSearch("latlon", true);
      } else {
        uri.addSearch("latlon", false);
      }
      window.history.replaceState("", "", uri.search());
    }

    // Change the view
    this.ChangeMenuOption(y, this.MenuOptions.LatLon, true, () => {
      Lines.lineBuffers();
    });
  }

  ChangeCenterMenu(methods, y) {
    // Change settings
    // const y = jQuery("#" + this.MenuOptions.PacificCentered.id)[0].checked;
    this._settings.pacificCenter = y === true ? true : false;

    // Change URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("center");
      if (y === true) {
        uri.addSearch("center", true);
      } else {
        uri.addSearch("center", false);
      }
      window.history.replaceState("", "", uri.search());
    }

    // Change view
    this.ChangeMenuOption(y, this.MenuOptions.PacificCentered, true, () => {
      methods.initBuffers();
    });
  }

  ChangeSmoothGridMenu(World, y) {
    // Change settings
    // const y = jQuery("#" + this.MenuOptions.SmoothGrid.id)[0].checked;
    this._settings.smoothGridBoxValues = y === true ? true : false;

    // Change URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("smoothGrid");
      if (y === true) {
        uri.addSearch("smoothGrid", true);
      } else {
        uri.addSearch("smoothGrid", false);
      }
      window.history.replaceState("", "", uri.search());
    }

    // Change view
    this.ChangeMenuOption(y, this.MenuOptions.SmoothGrid, true, () => {
      World.worldBuffers();
    });
  }

  changeLevel(Levels, y, functionToCall) {
    // Change settings
    this._settings.Level_ID = y;
    const index = Levels.Level_ID.indexOf(y);
    this._settings.LevelName = Levels.Name[index];

    // Change URI
    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("level");
      uri.addSearch("level", y);
      window.history.replaceState("", "", uri.search());
    }

    // Change view
    if (!(functionToCall === undefined)) {
      functionToCall();
    }
  }

  // Other Options
  /*
  ChangeColorMap(ui, callback) {
    var item = this.item.children();

    this._settings.currColormapName = item.attr('FullName');

    var currColorMap = ColorMaps.filter(function (obj) {
      return obj.FullName == this._settings.currColormapName;
    });

    //displaySettings.currColorMap = currColorMap[0].ColorMap;
    this._settings.functionForColorMap = currColorMap[0].Function;
    callback();

    var locationColorMap = GetLocationOfColorMap(currColorMap[0].FullName);
    var uri = new URI(window.location.href);
    uri.removeSearch("colorMap");
    uri.addSearch("colorMap", locationColorMap);
    window.history.replaceState("", "", uri.search());
  }
  */

  ChangeUpperBoundMenu(Gl, ColorMap, upperBound) {
    this._settings.maxValue = upperBound;
    Gl.worldBuffers();
    ColorMap.drawLegend();
  }

  ChangeLowerBoundMenu(Gl, ColorMap, lowerBound) {
    this._settings.minValue = lowerBound;
    Gl.worldBuffers();
    ColorMap.drawLegend();
  }

  ChangeDate(newDate, functionToRun) {
    this._settings.CurrDate = newDate;
    const newYear = parseInt(newDate.substring(0, 4), 10);
    const newMonth = parseInt(newDate.substring(5, 7), 10);
    // jQuery("#slider_year").slider(newYear);
    // jQuery('#mySelect option[value="fg"]').attr('selected', true)
    // jQuery('#monthMenu option[value="' + newDate.substring(5, 7) + '"]').attr('selected', "selected").attr("selected", true);
    // jQuery("#monthMenu").selectmenu("refresh");
    // jQuery("#levelRadio" + this._settings.Level_ID).prop('checked', true).button("refresh");
    // jQuery('#year').val(newYear.toString());

    if (!(functionToRun === undefined)) {
      functionToRun();
    }

    if (this._settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("date");
      uri.addSearch("date", this._settings.CurrDate);
      window.history.replaceState("", "", uri.search());
    }
  }

  LoadSphereData(Data, settings) {
    Data.LoadSphereData(settings.LayerSettings);
  }

  ChangeMonth(Data, settings, newMonth) {
    const currYear = this._settings.CurrDate.substring(0, 4);
    const newDate = currYear + "-" + newMonth + "-01";
    this.ChangeDate(newDate, () => {
      Data.LoadSphereData(settings.LayerSettings);
    });
  }

  ChangeYear(Data, settings, newYear, padLeft) {
    newYear = padLeft(newYear, 4);
    const currMonth = this._settings.CurrDate.substring(5, 7);
    const newDate = newYear + "-" + currMonth + "-01";
    this.ChangeDate(newDate, () => {
      Data.LoadSphereData(settings.LayerSettings);
    });
  }

  // Grab options from URL
  /*
  SetOptionsFromUrl(Gl, ColorMaps, callback) {
    var uri = new URI(window.location.href);
    var parameters = uri.search(true);

    // Movement
    if (parameters.hasOwnProperty("rMatrix")) {
      var rMatrix = parameters.rMatrix.split(",");
      for (var i = 0; i < rMatrix.length; i++) {
        Gl.earthRotationMatrix[i] = parseFloat(rMatrix[i]);
      }
    }

    if (parameters.hasOwnProperty("rMatrixX")) {
      var rMatrixX = parameters.rMatrixX.split(",");
      for (var i = 0; i < rMatrix.length; i++) {
        Gl.earthRotationMatrix_x[i] = parseFloat(rMatrixX[i]);
      }
    }

    if (parameters.hasOwnProperty("rMatrixY")) {
      var rMatrixY = parameters.rMatrixY.split(",");
      for (var i = 0; i < rMatrix.length; i++) {
        Gl.earthRotationMatrix_y[i] = parseFloat(rMatrixY[i]);
      }
    }

    if (parameters.hasOwnProperty("xMov")) {
      this.xMovement = parseFloat(parameters.xMov);
    }

    if (parameters.hasOwnProperty("yMov")) {
      this.yMovement = parseFloat(parameters.yMov);
    }

    // Zoom
    if (parameters.hasOwnProperty("zoom")) {
      this.zoomLevel = parseFloat(parameters.zoom);
    }

    // Level_ID
    this._settings.Level_ID = 1;
    if (parameters.hasOwnProperty("level")) {
      this._settings.Level_ID = parseInt(parameters.level);
    }

    // Date
    if (parameters.hasOwnProperty("date")) {
      this.ChangeDate(parameters.date, null);
    }

    // database
    var database;
    if (parameters.hasOwnProperty("database")) {
      var currDatabase = this.GetDatasetById(parseInt(parameters.database));
      if (parameters.hasOwnProperty("date")) {
        database = this.ChangeDatasetDate(currDatabase, this._settings.CurrDate, this._settings.Level_ID, null);
      } else {
        database = this.ChangeDataset(currDatabase, this._settings.Level_ID, null);
      }
    }

    // Colormap
    if (parameters.hasOwnProperty("colorMap")) {
      var currColorMap = ColorMaps[parseInt(parameters.colorMap)];
      this._settings.functionForColorMap = currColorMap.Function;
      this._settings.currColormapName = currColorMap.FullName;
    }

    var bumpMapping;
    if (parameters.hasOwnProperty("bumpMapping")) {
      bumpMapping = this.ChangeBumpMapping(Gl, parameters.bumpMapping);
    }

    var geoLines;
    if (parameters.hasOwnProperty("geoLines")) {
      if (parameters.geoLines == 'true') {
        geoLines = this.ChangeMenuOption(true, this.MenuOptions.GeoLines, false, null);
      }
    }

    var globe;
    if (parameters.hasOwnProperty("globe")) {
      globe = this.ChangeMenuOption(parameters.globe, this.MenuOptions.Globe, false, null);
    }

    var smoothGrid;
    if (parameters.hasOwnProperty("smoothGrid")) {
      if (parameters.smoothGrid == 'true') {
        smoothGrid = this.ChangeMenuOption(true, this.MenuOptions.SmoothGrid, false, null);
      }
    }

    var centered;
    if (parameters.hasOwnProperty("center")) {
      if (parameters.center == 'true') {
        centered = this.ChangeMenuOption(true, this.MenuOptions.PacificCentered, false, null);
      }
    }

    var timeZones;
    if (parameters.hasOwnProperty("timeZones")) {
      if (parameters.timeZones == 'true') {
        timeZones = this.ChangeMenuOption(true, this.MenuOptions.TimeZone, false, null);
      }
    }

    var minorIslands;
    if (parameters.hasOwnProperty("minorIslands")) {
      if (parameters.minorIslands == 'true') {
        minorIslands = this.ChangeMenuOption(true, this.MenuOptions.MinorIslands, false, null);
      }
    }

    var latLon;
    if (parameters.hasOwnProperty("latlon")) {
      if (parameters.latlon == 'true') {
        latLon = this.ChangeMenuOption(true, this.MenuOptions.LatLon, false, null);
      }
    }

    var rivers;
    if (parameters.hasOwnProperty("rivers")) {
      rivers = this.ChangeMenuOption(parameters.rivers, this.MenuOptions.Rivers, false, null);
    }

    var coasts;
    if (parameters.hasOwnProperty("coasts")) {
      coasts = this.ChangeMenuOption(parameters.coasts, this.MenuOptions.Coasts, false, null);
    }

    var lakes;
    if (parameters.hasOwnProperty("lakes")) {
      lakes = this.ChangeMenuOption(parameters.lakes, this.MenuOptions.Lakes, false, null);
    }

    jQuery.when(database, timeZones, rivers, minorIslands, bumpMapping, lakes,coasts, centered, globe, latLon, geoLines).then(function(){

      // database

      // Level_id
      if (parameters.hasOwnProperty("level")) {
        this.changeLevel(this._settings.Level_ID.toString());
        jQuery("#levelRadio" + this._settings.Level_ID).prop('checked', true).button("refresh");
      }

      // GeoLines
      if (parameters.hasOwnProperty("geoLines")) {
        if (parameters.geoLines == 'true') {
          this._settings.geoLines = true;
        } else {
          this._settings.geoLines = false;
        }
        var id = this.MenuOptions.GeoLines.id;
        jQuery("#" + id).prop('checked', this._settings.geoLines);
      }

      // Toggle Options
      {
        /*function SetToggleProperties(property, setting, id){
         if (parameters.hasOwnProperty(property)) {
         if (parameters[property] == 'true') {
         setting = true;
         } else {
         setting = false;
         }
         jQuery("#" + id).prop('checked', setting);
         }
         }

         SetToggleProperties("smoothGrid", this._settings.smoothGridBoxValues, this.MenuOptions.SmoothGrid.id);
         SetToggleProperties("center", this._settings.pacificCenter, this.MenuOptions.PacificCentered.id);*/

  /*
        // SmoothGrid
        if (parameters.hasOwnProperty("smoothGrid")) {
          if (parameters.smoothGrid == 'true') {
            this._settings.smoothGridBoxValues = true;
          } else {
            this._settings.smoothGridBoxValues = false;
          }
          var id = this.MenuOptions.SmoothGrid.id;
          jQuery("#" + id).prop('checked', this._settings.smoothGridBoxValues);
        }

        // Pacific Centered
        if (parameters.hasOwnProperty("center")) {
          if (parameters.center == 'true') {
            this._settings.pacificCenter = true;
          } else {
            this._settings.pacificCenter = false;
          }
          var id = this.MenuOptions.PacificCentered.id;
          jQuery("#" + id).prop('checked', this._settings.pacificCenter);
        }

        // Timezone
        if (parameters.hasOwnProperty("timeZones")) {
          if (parameters.timeZones == 'true') {
            this._settings.timeZones = true;
          } else {
            this._settings.timeZones = false;
          }
          var id = this.MenuOptions.TimeZone.id;
          jQuery("#" + id).prop('checked', this._settings.timeZones);
        }

        // LatLon
        if (parameters.hasOwnProperty("latlon")) {
          if (parameters.latlon == 'true') {
            this._settings.latLons = true;
          } else {
            this._settings.latLons = false;
          }
          var id = this.MenuOptions.LatLon.id;
          jQuery("#" + id).prop('checked', this._settings.latLons);
        }
      }

      // Globe
      if (parameters.hasOwnProperty("globe")) {
        this.GlobeViewSettings(parameters.globe, false);
        this._settings.globeView = parameters.globe;
        var id = this.GetMenuOption(this.MenuOptions.Globe, parameters.globe).id;
        jQuery("#" + id).prop('checked', true);//.button("refresh");
      }

      // Bump Mapping
      if (parameters.hasOwnProperty("bumpMapping")) {
        if (parameters.bumpMapping.length > 0) {
          this._settings.lightingEnabled = true;
        } else {
          this._settings.lightingEnabled = false;
        }
        var id = this.GetMenuOption(this.MenuOptions.BumpMapping, parameters.bumpMapping).id;
        jQuery("#" + id).prop('checked', true);//.button("refresh");
      }

      // Rivers
      if (parameters.hasOwnProperty("rivers"))
      {
        if (parameters.rivers.length > 0) {
          this._settings.rivers = true;
        } else {
          this._settings.rivers = false;
        }
        var id = this.GetMenuOption(this.MenuOptions.Rivers, parameters.rivers).id;
        jQuery("#" + id).prop('checked', true);//.button("refresh");
      }

      // Coasts
      if (parameters.hasOwnProperty("coasts"))
      {
        this._settings.CoastsType = parameters.coasts;
        if (parameters.coasts.length > 0) {
          this._settings.coasts = true;
        } else {
          this._settings.coasts = false;
        }
        var id = this.GetMenuOption(this.MenuOptions.Coasts, parameters.coasts).id;
        jQuery("#" + id).prop('checked', true);//.button("refresh");
      }

      // Lakes
      if (parameters.hasOwnProperty("lakes"))
      {
        this._settings.LakesType = parameters.coasts;
        if (parameters.lakes.length > 0) {
          this._settings.lakes = true;
        } else {
          this._settings.lakes = false;
        }
        var id = this.GetMenuOption(this.MenuOptions.Lakes, parameters.lakes).id;
        jQuery("#" + id).prop('checked', true);//.button("refresh");
      }

      // Minor Islands
      if (parameters.hasOwnProperty("minorIslands")) {
        if (parameters.minorIslands == 'true') {
          this._settings.minorIslands = true;
        } else {
          this._settings.minorIslands = false;
        }
        var id = this.MenuOptions.MinorIslands.id;
        jQuery("#" + id).prop('checked', true);

      }
      callback();
    });
  }
  */

  createCsvFromGriddedData(RawData) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Create the header
    csvContent += "Latitude,Longitude,Value\n";
    if (RawData.Lat.length > 0) {
      for (let i = 0; i < RawData.Lat.length; i++) {
        const dataString =
          RawData.Lat[i] + "," + RawData.Lon[i] + "," + RawData.ValueFinal[i];
        csvContent += dataString + "\n";
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        this._settings.DatabaseStore +
          "_GridData_" +
          this._settings.CurrDate +
          ".csv"
      );
      link.click();
    } else {
      jQuery("#dialogNoData").dialog("open");
    }
  }

  /*
  ChangeDatasetMenu(ui, level_id) {
    var item = this.item.children();
    var currDataset = this.GetDatasetByStore(item.attr('DatabaseStore'));
    this.ChangeDataset(currDataset, level_id, function(){
      worldBuffers();
      if (RawData.Lat.length > 0) {
        ColorMap.drawLegend();
      }
    });
  }
  */

  GetDatasetById(Data, id) {
    for (let i = 0; i < Data.MenuData.length; i++) {
      if (Data.MenuData[i].hasOwnProperty("Dataset_ID")) {
        const currDataset = Data.MenuData[i];
        if (currDataset.Dataset_ID === id) {
          return currDataset;
        }
      }
    }
  }

  /*
  ChangeDataset(Data, Settings, dataset, level_id, callbackFunc) {
    return this.ChangeDatasetDate(Data, Settings, dataset, dataset.StartDate, level_id, callbackFunc);
  }

  ChangeDatasetDate(Data, Settings, dataset, currDate, level_id, callbackFunc) {
    this._settings.FullName = dataset.FullName;
    this._settings.CurrDate = currDate;
    this._settings.StartDate = dataset.StartDate;
    this._settings.EndDate = dataset.EndDate;
    this._settings.DatabaseStore = dataset.DatabaseStore;
    this._settings.Dataset_ID = dataset.Dataset_ID;
    this._settings.OriginalLocation = dataset.OriginalLocation;
    this._settings.Level_ID = level_id;
    this._settings.DataUnits = dataset.Units;
    this._settings.LevelName = dataset.DefaultLevel;
    var yearMin = this._settings.StartDate.substring(0, 4);
    var yearMax = this._settings.EndDate.substring(0, 4);
    var slider = jQuery("#slider_year")[0];
    slider.min = yearMin;
    slider.max = yearMax;
    slider.value = parseInt(this._settings.CurrDate.substring(0, 4));
    //jQuery("#slider_year").refresh();
    var levelDeferred = Data.LoadLevelDataMenu(Settings.LayerSettings);
    jQuery.when(levelDeferred).then(sphereDeferred = Data.LoadSphereDataMenu(Settings.LayerSettings, callbackFunc));

    jQuery("div#divYearMin").text(yearMin);
    jQuery("div#divYearMax").text(yearMax);
    jQuery("div#divTitle").text(this._settings.FullName);
    //jQuery("div#gridBoxSize").style("display", "none");
    //document.getElementById("gridBoxSize").style.display = "none";
    return jQuery.when(levelDeferred);
  }
  */

  /*
  DropDownDataMenu(World, Data, y) {
    var selectedMenu = JSON.parse(y);

    var titleBar = jQuery('#TitleBar');
    var depth = selectedMenu.depth+1;
    var currData = jQuery.grep(Data.MenuData, function(e){
      return e.parentId == selectedMenu.id;
    });

    if (currData.length > 0 ) {
      // Remove menus with depth higher than the current one
      var allMenus = jQuery("[id^=menu_]");
      for (var i = 0; i < allMenus.length; i++) {
        var currNum = allMenus[i].id.split("_")[1];
        if (parseInt(currNum) >= depth) {
          allMenus[i].remove();
        }
      }

      var firstMenu = '<div class="col s3" id="menu_' + depth + '">';
      firstMenu += '<select onchange="this.DropDownDataMenu(this.value)"><option value="" disabled selected>Select Datasets</option>';
      for (var i = 0; i < currData.length; i++) {
        var currValue = {depth: depth, parentId: currData[i].parentId, id: currData[i].id};
        firstMenu += '<option value=' + JSON.stringify(currValue) + '>' + currData[i].name + '</option>';
      }
      firstMenu += '</select></div>';
      titleBar.append(firstMenu);
      jQuery(document).ready(function() {
        jQuery('select').material_select();
      });
    } else {
      currData = jQuery.grep(Data.MenuData, function(e){
        return e.id == selectedMenu.id;
      });
      if (currData.length == 1) {
        this.ChangeDataset(currData[0], 1, function(){
          World.worldBuffers();
          if (RawData.Lat.length > 0) {
            ColorMap.drawLegend();
          }
        });
      }
    }
  }
  */
}
