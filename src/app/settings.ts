import { Dataset } from "./Dataset";
/**
 * Created by dafre on 5/11/2017.
 */

import * as glMatrix from "gl-matrix";

export enum GlobeViewType {
  Ortho,
  ThreeDim,
  TwoDim
}

export class Settings {
  // Debug settings
  EnableUri = false;

  // Layer Relating settings
  Levels: any;
  Datasets: Dataset[];
  Dataset: Dataset;
  FullName = "";
  StartDate: string = null;
  EndDate: string = null;
  CurrDate: string = null;
  CurrGridBoxId: number = null;
  CurrGridBoxLat: number = null;
  CurrGridBoxLon: number = null;
  CurrGridBoxValue: number = null;
  Dataset_ID: number = null;
  DatabaseStore: string = null;
  OriginalLocation: string = null;
  LevelName: string = null;
  Level_ID: number = null;
  TemperatureType = "C";
  TemperatureSymbol = "\u2103";
  DatabaseName: string = null;
  DataUnits = "";
  originalMaxValue: number = null;
  originalMinValue: number = null;
  maxValue: number = null;
  minValue: number = null;
  animate = false;
  ServerString: string;

  usingUserData = false;
  userLatLonVal: any;

  // Legend Slider settings
  scientificNotation = false;
  newMin: number;
  newMax: number;

  private Rivers: any[] = [
    {
      value: "Low",
      file: "./assets/ne_110m_rivers_lake_centerlines.json"
    },
    {
      value: "Medium",
      file: "./assets/ne_50m_rivers_lake_centerlines.json"
    },
    {
      value: "High",
      file: "./assets/ne_10m_rivers_lake_centerlines.json"
    },
    {
      value: "None",
      file: ""
    }
  ];

  private BumpMapping: any[] = [
    {
      value: "Land",
      file: "./assets/earth_normalmap_flat_8192x4096.jpg"
    },
    {
      value: "Land & Bathymetry",
      file: "./assets/earth_normalmap_8192x4096.jpg"
    },
    {
      value: "None",
      file: ""
    }
  ];

  private Lakes: any[] = [
    {
      value: "Low",
      file: "./assets/ne_110m_lakes.json"
    },
    {
      value: "Medium",
      file: "./assets/ne_50m_lakes.json"
    },
    {
      value: "High",
      file: "./assets/ne_10m_lakes.json"
    },
    {
      value: "None",
      file: ""
    }
  ];

  private Coasts: any[] = [
    {
      value: "Low",
      file: "./assets/ne_110m_coastline.json"
    },
    {
      value: "Medium",
      file: "./assets/ne_50m_coastline.json"
    },
    {
      value: "High",
      file: "./assets/ne_10m_coastline.json"
    },
    {
      value: "None",
      file: ""
    }
  ];

  // display related settings
  currColormapName =
    "Color Brewer 2.0|Diverging|Non Centered|11-class Spectral Inverse";
  smoothGridBoxValues = true;
  globeView: GlobeViewType = GlobeViewType.Ortho;
  functionForColorMap = "customColorMap";
  CoastsType = "./assets/ne_110m_coastline.json";
  LakesType = "Low";
  RiversType = "Low";
  pacificCenter = false;
  coasts = true;
  minorIslands = false;
  rivers = true;
  lakes = true;
  latLons = true;
  geoLines = false;
  timeZones = false;
  lightingEnabled = false;
  lightDirection: number[];
  lightDirectionColor: number[] = [1.0, 1.0, 1.0];
  lightAmbient: number[] = [0.2, 0.2, 0.2];
  viewportHeight: number;
  viewportWidth: number;

  EarthRadius = 80;

  TimeSeries_date: any[];
  TimeSeries_value: any[];

  ui: true;

  shaderProgram: null;

  triangleVertexPositionBuffer: null;
  squareVertexPositionBuffer: null;

  inMenu: false;
  timeSeriesAvailable: false;

  rGlobe: 0;
  lastTime: 0;
  toolTipData: Array<{
    name: string;
    series: string;
    value: string;
  }>;

  public getToolTipData(jsonString) {
    // Get graph tool tip data for a single level
    this.toolTipData = [];
    const jsonArr = JSON.parse(jsonString);
    this.toolTipData.push({
      name: jsonArr.name,
      value: jsonArr.value.toFixed(2),
      series: jsonArr.series
    });
    return this.toolTipData;
  }

  public getSeriesToolTipData(jsonString) {
    // Get graph tool tip data for multiple levels
    this.toolTipData = [];
    const jsonArr = JSON.parse(jsonString);
    for (let i = 0; i < jsonArr.length; i++) {
      this.toolTipData.push({
        name: jsonArr[i].name,
        value: jsonArr[i].value.toFixed(2),
        series: jsonArr[i].series
      });
    }
    return this.toolTipData;
  }

  setSliderMax(max) {
    // set max value when the slider updates
    if (max !== null || max !== this.newMax) {
      this.newMax = max;
      return true;
    }
    return false;
  }

  setSliderMin(min) {
    // set min value when the slider updates
    if (min !== null || min !== this.newMax) {
      this.newMin = min;
      return true;
    }
    return false;
  }

  // TODO: Change "Default" in database with "Single Layer"
  levelCheck(str) {
    if (str === "Default") {
      return "Single Level";
    } else {
      return str;
    }
  }

  // TODO: HACK: We should move this to the database. So the value just comes from a column so we don't need this function
  public GenerateTitle(str): string {
    // Title for main view.. returns in format: "DatasetName | Pressure Level"
    if (str === "") {
      return " ";
    }
    // Remove any text in opening and closing bracket in the Title like (10mb-100mb)
    str = str.replace(/ *\([^)]*\) */g, "");

    let r: any[];
    r = str.split("|");
    if (r.length < 5) {
      // TODO: These returns should be replaced with a new column from the database.
      // there is some backend work to be done to return this column correctly
      // for now, we are dependant on how we name the climate databases in the 4dvd database
      return r[1] + " | " + r[r.length - 1];
    }
    return r[r.length - 2] + " | " + r[r.length - 1];
  }

  // TODO: HACK: We should move this to the database. So the value just comes from a column so we don't need this function
  GenerateSimpleTitle(str): string {
    // Title without units.. returns in format: "DatasetName"
    if (str === "") {
      return " ";
    }
    let r: any[];
    r = str.split("|");
    if (r.length < 5) {
      // TODO: These returns should be replaced with a new column from the database.
      // there is some backend work to be done to return this column correctly
      // for now, we are dependant on how we name the climate databases in the 4dvd database
      return r[1];
    } else {
      return r[r.length - 2];
    }
  }

  // TODO: HACK: We should move this to the database. So the value just comes from a column so we don't need this function
  JustUnits(): string {
    // returns just the units.. in format: "Units"
    const title = this.GenerateSimpleTitle(this.FullName);
    if (title.search("Temperature") >= 0) {
      return "\xB0C";
    } else {
      return this.DataUnits;
    }
  }

  GetLatWithDir() {
    let lat = Number(this.CurrGridBoxLat.toFixed(2));
    if (lat < 0) {
      lat = Math.abs(lat);
      return lat + "\xB0 S";
    } else if (lat > 0) {
      return lat + "\xB0 N";
    } else {
      return lat;
    }
  }

  GetLonWithDir() {
    let lon = Number(this.CurrGridBoxLon.toFixed(2));
    if (lon < 0) {
      lon = Math.abs(lon);
      return lon + "\xB0 W";
    } else if (lon > 0) {
      return lon + "\xB0 E";
    } else {
      return lon;
    }
  }

  GetBumpmappingFile(value) {
    for (let i = 0; i < this.BumpMapping.length; i++) {
      if (value === this.BumpMapping[i].value) {
        return this.BumpMapping[i].file;
      }
    }
    return null;
  }

  GetRiversFile(value) {
    for (let i = 0; i < this.Rivers.length; i++) {
      if (value === this.Rivers[i].value) {
        return this.Rivers[i].file;
      }
    }
    return null;
  }

  GetCoastsFile(value) {
    for (let i = 0; i < this.Coasts.length; i++) {
      if (value === this.Coasts[i].value) {
        return this.Coasts[i].file;
      }
    }
    return null;
  }

  GetLakesFile(value) {
    for (let i = 0; i < this.Lakes.length; i++) {
      if (value === this.Lakes[i].value) {
        return this.Lakes[i].file;
      }
    }
    return null;
  }

  constructor() {
    this.lightDirection = glMatrix.vec3.create();
    this.CurrGridBoxId = -1;
  }
}
