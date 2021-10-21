import { ElementRef } from "@angular/core";
import { GetJson } from "./getJson";
import { Model } from "./model";
import { ViewComponent } from "./view.component";
/**
 * Created by dafre on 5/16/2017.
 */

export class Controller {
  private _model: Model;
  private _view: ViewComponent;

  public constructor(model: Model, view: ViewComponent) {
    this._model = model;
    this._view = view;
  }

  public changeLatLon(enabled: boolean) {
    this._model.settings.latLons = enabled;
    this._model.loadLatLonLines(enabled);
  }

  public changeGeoLines(enabled: boolean) {
    this._model.settings.geoLines = enabled;
    this._model.loadGeoLines(enabled);
  }

  public changeTimezoneLines(enabled: boolean) {
    this._model.settings.timeZones = enabled;
    this._model.loadTimeZoneLines(enabled);
  }

  public changeMinorIslandsLines(enabled: boolean) {
    this._model.settings.minorIslands = enabled;
    this._model.loadMinorIslandsLines(enabled);
  }

  public changeSmoothGrid(enabled: boolean) {
    this._model.settings.smoothGridBoxValues = enabled;
    this._model.changeSmoothGrid(enabled);
  }

  public changePacificCentered(enabled: boolean) {
    this._model.settings.pacificCenter = enabled;
    this._model.changePacificCentered(enabled);
  }

  public loadUserDataset(dataset, date, level, userData) {
    this._model.loadUserDataset(dataset, date, level, userData);
  }

  public loadUserLevels(dataset, userData) {
    this._model.loadUserLevels(dataset, userData);
  }

  public loadDataset(dataset, date, level) {
    this._model.loadDataset(dataset, date, level);
  }

  public loadLevels(dataset) {
    this._model.loadLevels(dataset);
  }

  public changeView(
    view,
    ui,
    earthRotationMatrix,
    earthRotationMatrix_x,
    earthRotationMatrix_y
  ) {
    this._model.changeView(
      view,
      ui,
      earthRotationMatrix,
      earthRotationMatrix_x,
      earthRotationMatrix_y
    );
  }

  public getBumpMapping(value) {
    return this._model.GetBumpmappingFile(value);
  }

  public changeRivers(rivers) {
    const riversFile = this._model.settings.GetRiversFile(rivers);
    if (riversFile != null) {
      this._model.settings.RiversType = rivers;
      this._model.loadRivers(riversFile);
    } else {
      alert("Invalid option: " + rivers);
    }
  }

  public changeCoasts(coasts) {
    const coastsFile = this._model.settings.GetCoastsFile(coasts);
    if (coastsFile != null) {
      this._model.settings.CoastsType = coasts;
      this._model.loadCoasts(coastsFile);
    } else {
      alert("Invalid option: " + coasts);
    }
  }

  public changeLakes(lakes) {
    const lakesFile = this._model.settings.GetLakesFile(lakes);
    if (lakesFile != null) {
      this._model.settings.LakesType = lakes;
      this._model.loadLakes(lakesFile);
    } else {
      alert("Invalid option: " + lakes);
    }
  }

  public ChangeColorMap(colorMap) {
    this._model.ChangeColorMap(colorMap);

    /*var locationColorMap = GetLocationOfColorMap(currColorMap[0].FullName);
    var uri = new URI(window.location.href);
    uri.removeSearch("colorMap");
    uri.addSearch("colorMap", locationColorMap);
    window.history.replaceState("", "", uri.search());*/
  }
}
