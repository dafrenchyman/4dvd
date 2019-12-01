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
    "Color Brewer 2.0|Diverging|Zero Centered|11-class Spectral Inverse";
  smoothGridBoxValues = true;
  globeView: GlobeViewType = GlobeViewType.Ortho;
  functionForColorMap = "customColorMapWithMidpoint";
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

  StringToArray(str): string {
    if (str === '') {
      return ' ';
    }
    let r: any[];
    r = str.split('|');
    if (r.length < 5) {
      return 'Precipitation';
    }
    return r[r.length - 2];
  }

  constructor() {
    this.lightDirection = glMatrix.vec3.create();
    this.CurrGridBoxId = -1;
  }
}
