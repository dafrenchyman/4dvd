/**
 * Created by dafre on 5/16/2017.
 */

import { ColorMap } from "./ColorMap";
import { GetJson } from "./getJson";
import { GlMatrix } from "./GlMatrix";
import { Helpers } from "./helpers";
import { Legend } from "./legend";
import { Lines } from "./lines";
import { Loaders } from "./loaders";
import { GlobeViewType, Settings } from "./settings";
import { TimeseriesData } from "./timeseriesData";
import { ViewComponent } from "./view.component";
import { World } from "./world";

declare var jQuery: any;
declare var URI: any;

export class Model {
  private _observers: ViewComponent[];
  private _getJson: GetJson;

  public loaders: Loaders;
  public colorMap: ColorMap;
  public settings: Settings;

  public _world: World;
  public _lines: Lines;
  private colorMapLoader: Promise<object>;
  public settingsLoader: Promise<object>;
  private finishedLoading: boolean;
  public legend: Legend;
  public timeseriesData: [TimeseriesData];

  private rawGridData: any;
  private rawTimeseriesData: any;

  public constructor(gl: WebGLRenderingContext, getJson: GetJson) {
    this.finishedLoading = false;
    this._getJson = getJson;
    this._observers = [];

    this.settings = new Settings();

    // ColorMap
    this.colorMapLoader = this._getJson.getAll("./assets/colorMaps.json");
    this.colorMapLoader.then(result => {
      this.colorMap = new ColorMap(result);
      this._world = new World(gl, this.colorMap, this.settings);
      this._lines = new Lines(gl, this.settings, this.colorMap);

      // Load the legend
      this.legend = new Legend(this.colorMap, this.settings);
    });

    // Server Settings
    this.settingsLoader = this._getJson.getAll("./assets/settings.json");
    this.settingsLoader.then(result => {
      const results: any = result;
      this.settings.ServerString = results.Server;
      this.loaders = new Loaders(this._getJson, this.settings);
    });
  }

  public changeView(
    view,
    ui,
    earthRotationMatrix,
    earthRotationMatrix_x,
    earthRotationMatrix_y
  ) {
    switch (view) {
      case "3D":
        this.settings.globeView = GlobeViewType.ThreeDim;
        ui.xMovement = 0;
        ui.yMovement = 0;
        ui.zoomLevel = 80;
        this._lines.processAllLineData();
        this._world.processBuffers();
        break;
      case "3D Orthographic":
        this.settings.globeView = GlobeViewType.Ortho;
        ui.xMovement = 0;
        ui.yMovement = 0;
        ui.zoomLevel = -165;
        this._lines.processAllLineData();
        this._world.processBuffers();
        break;
      case "2D Mercator":
        this.settings.globeView = GlobeViewType.TwoDim;
        GlMatrix.mat4.identity(earthRotationMatrix);
        GlMatrix.mat4.identity(earthRotationMatrix_x);
        GlMatrix.mat4.identity(earthRotationMatrix_y);
        ui.xMovement = 0;
        ui.yMovement = 0;
        ui.zoomLevel = 70;
        this._lines.processAllLineData();
        this._world.processBuffers();
        // this.loadDataset("jp_Mon_gaus_mono_air_sfc_mon_mean", "0001-01-01", "1");
        break;
      default:
        alert("Invalid View");
    }
  }

  public loadUserLevels(dataset, userData) {
    this.settings.usingUserData = true;
    const results: any = userData;
    const levels: Array<{
      Level_ID: number;
      Name: string;
      Selected: boolean;
    }> = [];
    let levelName = "";
    for (let counter = 0; counter < results.Level_ID.length; counter++) {
      const selected: boolean = counter === 0 ? true : false;
      if (results.Level_ID[counter] === 1) {
        levelName = results.Name[counter];
      }
      levels.push({
        Level_ID: Number(results.Level_ID[counter]),
        Name: results.Name[counter],
        Selected: selected
      });
    }
    this.settings.Levels = levels;
    this.settings.Level_ID = 1;
    this.settings.LevelName = levelName;
  }

  public loadUserDataset(dataset, date, level_id, userData) {
    this.settings.usingUserData = true;
    this.settings.Dataset = dataset;
    this.settings.DataUnits = dataset.Units;
    this.settings.CurrDate = date;
    this.settings.FullName = dataset.FullName;

    this.rawGridData = userData;
    this.rawGridData.ValueFinal = [];
    this.rawGridData.ValueFinal = Helpers.ProcessRawDataValue(
      this.rawGridData.Value,
      this.settings
    );
    this.settings.originalMaxValue = Helpers.ArrayMax(
      this.rawGridData.ValueFinal
    );
    this.settings.originalMinValue = Helpers.ArrayMin(
      this.rawGridData.ValueFinal
    );
    jQuery("#upperBoundLimit").val(this.settings.originalMaxValue);
    jQuery("#lowerBoundLimit").val(this.settings.originalMinValue);
    this.settings.maxValue = Helpers.ArrayMax(this.rawGridData.ValueFinal);
    this.settings.minValue = Helpers.ArrayMin(this.rawGridData.ValueFinal);

    // Add the datasetID to the input options
    if (this.settings.EnableUri) {
      const uri = new URI(window.location.href);
      uri.removeSearch("database");
      uri.addSearch("database", this.settings.Dataset_ID);
      window.history.replaceState("", "", uri.search());
    }

    // Draw the world
    this._world.worldBuffers(this.rawGridData);

    // Update the levelId that's selected
    this.settings.Level_ID = level_id;
    let levelName = "";
    for (let i = 0; i < this.settings.Levels.length; i++) {
      if (this.settings.Levels[i].Level_ID === level_id) {
        levelName = this.settings.Levels[i].Name;
      }
      this.settings.Levels[i].Selected =
        level_id === this.settings.Levels[i].Level_ID ? true : false;
    }
    this.settings.LevelName = levelName;

    // Draw the legend
    this.legend.drawLegend();
  }

  public loadLevels(dataset) {
    this.settings.usingUserData = false;
    const filename =
      this.settings.ServerString +
      "assets/g_GetLevel.php" +
      "?dbname=" +
      dataset.DatabaseStore;

    const datasetLoader = this._getJson.getAll(filename);

    datasetLoader.then(result => {
      const results: any = result;
      const levels: Array<{
        Level_ID: number;
        Name: string;
        Selected: boolean;
      }> = [];
      let levelName = "";
      for (let counter = 0; counter < results.Level_ID.length; counter++) {
        const selected: boolean = counter === 0 ? true : false;
        if (results.Level_ID[counter] === 1) {
          levelName = results.Name[counter];
        }
        levels.push({
          Level_ID: Number(results.Level_ID[counter]),
          Name: results.Name[counter],
          Selected: selected
        });
      }
      this.settings.Levels = levels;
      this.settings.Level_ID = 1;
      this.settings.LevelName = levelName;
    });
  }

  public loadDataset(dataset, date, level_id) {
    this.settings.usingUserData = false;
    // if userData we will need to provide a user dataset, user date, user level_id
    this.settings.Dataset = dataset;
    this.settings.DataUnits = dataset.Units;
    this.settings.CurrDate = date;
    this.settings.FullName = dataset.FullName;

    this.settingsLoader.then(() => {
      const filename =
        this.settings.ServerString +
        "assets/g_GetGridData.php" +
        "?dbname=" +
        dataset.DatabaseStore +
        "&date=" +
        date +
        "&level=" +
        level_id;

      const loader = this._getJson.getAll(filename);
      loader.then(result_sub => {
        this.rawGridData = result_sub;
        this.rawGridData.ValueFinal = [];
        this.rawGridData.ValueFinal = Helpers.ProcessRawDataValue(
          this.rawGridData.Value,
          this.settings
        );
        this.settings.originalMaxValue = Helpers.ArrayMax(
          this.rawGridData.ValueFinal
        );
        this.settings.originalMinValue = Helpers.ArrayMin(
          this.rawGridData.ValueFinal
        );
        jQuery("#upperBoundLimit").val(this.settings.originalMaxValue);
        jQuery("#lowerBoundLimit").val(this.settings.originalMinValue);
        this.settings.maxValue = Helpers.ArrayMax(this.rawGridData.ValueFinal);
        this.settings.minValue = Helpers.ArrayMin(this.rawGridData.ValueFinal);

        // Add the datasetID to the input options
        if (this.settings.EnableUri) {
          const uri = new URI(window.location.href);
          uri.removeSearch("database");
          uri.addSearch("database", this.settings.Dataset_ID);
          window.history.replaceState("", "", uri.search());
        }

        // Draw the world
        this._world.worldBuffers(this.rawGridData);

        // Update the levelId that's selected
        this.settings.Level_ID = level_id;
        let levelName = "";
        for (let i = 0; i < this.settings.Levels.length; i++) {
          if (this.settings.Levels[i].Level_ID === level_id) {
            levelName = this.settings.Levels[i].Name;
          }
          this.settings.Levels[i].Selected =
            level_id === this.settings.Levels[i].Level_ID ? true : false;
        }
        this.settings.LevelName = levelName;

        // Draw the legend
        this.legend.drawLegend();
      });
    });
  }

  public loadTimeseries(dataset, gridBoxId, level_id): Promise<object> {
    this.settings.Dataset = dataset;
    this.settings.CurrGridBoxId = gridBoxId;
    this.settings.DataUnits = dataset.Units;
    this.settings.FullName = dataset.FullName;

    if (this.settings.usingUserData) {
      return this.settings.userLatLonVal;
    } else {
      const rawTimeseriesData = new Promise<object>(resolve => {
        this.settingsLoader.then(result => {
          const filename =
            this.settings.ServerString +
            "assets/g_GetTimeseriesData.php" +
            "?dbname=" +
            dataset.DatabaseStore +
            "&gridboxId=" +
            this.settings.CurrGridBoxId +
            "&level=" +
            level_id;
          const loader = this._getJson.getAll(filename);
          loader.then(result2 => {
            resolve(result2);
          });
        });
      });
      return rawTimeseriesData;
    }
  }

  public loadTimeseries2(dataset, gridBoxId, level_id) {
    this.settingsLoader.then(result => {
      const filename =
        this.settings.ServerString +
        "assets/g_GetTimeseriesData.php" +
        "?dbname=" +
        dataset.DatabaseStore +
        "&gridboxId=" +
        this.settings.CurrGridBoxId +
        "&level=" +
        level_id;

      const loader = this._getJson.getAll(filename);
      loader.then(result_sub => {
        this.rawGridData = result_sub;

        this.rawGridData.ValueFinal = [];
        this.rawGridData.ValueFinal = Helpers.ProcessRawDataValue(
          this.rawGridData.Value,
          this.settings
        );
      });
    });
  }

  public GetBumpmappingFile(value) {
    const returnFile = this.settings.GetBumpmappingFile(value);
    this.settings.lightingEnabled = returnFile.length > 0 ? true : false;
    return returnFile;
  }

  public loadCoastsData(coasts) {
    this.colorMapLoader.then(results => {
      if (coasts.length > 0) {
        const loader = this._getJson.getAll(coasts);
        loader.then(result => {
          this._lines.coastsBuffers(result);
        });
      } else {
        this._lines.clearCoastsBuffers();
      }
    });
  }

  public loadLatLonLines(enabled: boolean) {
    this.colorMapLoader.then(results => {
      if (enabled) {
        this._lines.latLonLinesBuffers();
      } else {
        this._lines.clearLatLonLinesBuffers();
      }
    });
  }

  public loadRivers(rivers) {
    this.colorMapLoader.then(results => {
      if (rivers.length > 0) {
        const loader = this._getJson.getAll(rivers);
        loader.then(result => {
          this._lines.riversBuffers(result);
        });
      } else {
        this._lines.clearRiversBuffers();
      }
    });
  }

  public loadCoasts(coasts) {
    this.colorMapLoader.then(results => {
      if (coasts.length > 0) {
        const loader = this._getJson.getAll(coasts);
        loader.then(result => {
          this._lines.coastsBuffers(result);
        });
      } else {
        this._lines.clearCoastsBuffers();
      }
    });
  }

  public loadLakes(lakes) {
    this.colorMapLoader.then(results => {
      if (lakes.length > 0) {
        const loader = this._getJson.getAll(lakes);
        loader.then(result => {
          this._lines.lakesBuffers(result);
        });
      } else {
        this._lines.clearLakesBuffers();
      }
    });
  }

  public changeSmoothGrid(enabled: boolean) {
    if (this.rawGridData.hasOwnProperty("ValueFinal")) {
      this._world.worldBuffers(this.rawGridData);
    }
  }

  public changePacificCentered(enabled: boolean) {
    if (this.rawGridData.hasOwnProperty("ValueFinal")) {
      this._world.worldBuffers(this.rawGridData);
    }
    this._lines.processAllLineData();
  }

  public loadMinorIslandsLines(enabled: boolean) {
    this.colorMapLoader.then(results => {
      if (enabled) {
        const loader = this._getJson.getAll(
          "./assets/ne_10m_minor_islands_coastline.json"
        );
        loader.then(result => {
          this._lines.minorIslandsBuffers(result);
        });
      } else {
        this._lines.clearMinorIslandsBuffers();
      }
    });
  }

  public loadGeoLines(enabled: boolean) {
    this.colorMapLoader.then(results => {
      if (enabled) {
        const loader = this._getJson.getAll(
          "./assets/ne_110m_geographic_lines.json"
        );
        loader.then(result => {
          this._lines.geoLinesBuffers(result);
        });
      } else {
        this._lines.clearGeoLinesBuffers();
      }
    });
  }

  public loadTimeZoneLines(enabled: boolean) {
    this.colorMapLoader.then(results => {
      if (enabled) {
        const loader = this._getJson.getAll("./assets/ne_10m_time_zones.json");
        loader.then(result => {
          this._lines.geoTimezoneBuffers(result);
        });
      } else {
        this._lines.clearTimezoneLinesBuffers();
      }
    });
  }

  public RegisterObserver(view: ViewComponent) {
    this._observers.push(view);
  }

  public ChangeColorMap(colorMap) {
    this.settings.currColormapName = colorMap.FullName;
    this.settings.functionForColorMap = colorMap.Function;
    this._world.worldBuffers(this.rawGridData);

    // Draw the legend
    this.legend.drawLegend();
  }
}
