/**
 * Created by dafre on 5/16/2017.
 */

import {Controller} from "./controller";
import {Model} from "./model";
import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {Gl, Shaders} from "./gl";
import {UI} from "./ui";
import {GetJson} from "./getJson";
import {WebGLTextureEnh} from "./WebGLTextureEnh";
import {GlMatrix} from "./GlMatrix";
import {GlobeViewType, Settings} from "./settings";
import {Helpers} from "./helpers";
import {WebGLProgramEnh} from "./WebGLProgramEnh";

import * as glMatrix from 'gl-matrix';
import {MdDialog} from "@angular/material";
import {ColorMapMenu} from "./color-map-menu";
import {DatasetMenu} from "./dataset-menu";
import {TimeseriesMenu} from "./timeseries-menu";
declare var jQuery: any;

@Component({
  selector: 'climate-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  encapsulation: ViewEncapsulation.None,
  // providers: [GetJson]
})
export class ViewComponent implements OnInit {
  datasetTitle= 'Change the current dataset';
  timeTitle= 'Change the year and month';
  graphicTitle= 'Change visual settings';
  infoTitle= 'Download current data';
  colorMapDesc= 'Changes the color of data visualization';
  gridboxDesc= 'Modifies texture details';
  pacificDesc= 'In 2D view, centers the map on the Pacific Ocean';
  islandDesc= 'Toggles the inclusion of minor islands';
  latLonDesc= 'Toggles visibility of lat/lon lines';
  geoLineDes= 'Toggles visibility of geographical lines';
  timeZoneDesc= 'Toggles visibility of time zones';
  bumpDesc= 'Toggles the simulation of elevation on the current globe view';
  viewDesc= 'Toggles different types of map view';
  coastDesc= 'Toggles rendered quality of coastlines';
  riverDesc= 'Toggles rendered quality of rivers';
  lakeDesc= 'Toggles rendered quality of lakes';

  ngOnInit(): void {
  }
  @ViewChild('ClimateGl') private _canvas: ElementRef;
  @ViewChild('ClimateSystem') climateSystemRef: ElementRef;
  @ViewChild('WebglCanvas') webglCanvasRef: ElementRef;
  @ViewChild('sidenav') menuRef: ElementRef;

  viewSettingsOptions : any = {
    rivers : ["Low", "Medium", "High", "None"],
    lakes : ["Low", "Medium", "High", "None"],
    coasts : ["Low", "Medium", "High", "None"],
    bumpMapping: ["Land", "Land & Bathymetry", "None"],
    view: ["3D", "3D Orthographic", "2D Mercator"],
    timezones: [false, true],
    geolines: [false, true],
    latlonlines: [false, true],
    minorIslands: [false, true],
    smoothGrid: [false, true],
    pacificCentered: [false, true]
  };

  viewSettingsSelected : any = {
    level : "",
    rivers : "Low",
    lakes : "Low",
    coasts : "Low",
    bumpMapping : "None",
    view: "3D Orthographic",
    timezones : false,
    geolines : false,
    latlonlines : true,
    minorIslands : false,
    smoothGrid: true,
    pacificCentered: false
  };

  selectView(value) {
    this._controller.changeView(value, this.ui, this.earthRotationMatrix, this.earthRotationMatrix_x, this.earthRotationMatrix_y);
  }

  changeBumpMapping(value) {
    var texture = this._controller.getBumpMapping(value);
    this.initTextures (texture);
  }

  changePacificCentered() {
    this.viewSettingsSelected.pacificCentered = !this.viewSettingsSelected.pacificCentered;
    this._controller.changePacificCentered(this.viewSettingsSelected.pacificCentered);
  }

  changeSmoothGrid() {
    this.viewSettingsSelected.smoothGrid = !this.viewSettingsSelected.smoothGrid;
    this._controller.changeSmoothGrid(this.viewSettingsSelected.smoothGrid);
  }

  changeGeolines() {
    this.viewSettingsSelected.geolines = !this.viewSettingsSelected.geolines;
    this._controller.changeGeoLines(this.viewSettingsSelected.geolines);
  }

  changeMinorIslandsLines() {
    this.viewSettingsSelected.minorIslands = !this.viewSettingsSelected.minorIslands;
    this._controller.changeMinorIslandsLines(this.viewSettingsSelected.minorIslands);
  }

  changeLatlonlines() {
    this.viewSettingsSelected.latlonlines = !this.viewSettingsSelected.latlonlines;
    this._controller.changeLatLon(this.viewSettingsSelected.latlonlines);
  }

  changeTimezones() {
    this.viewSettingsSelected.timezones = !this.viewSettingsSelected.timezones;
    this._controller.changeTimezoneLines(this.viewSettingsSelected.timezones);
  }

  selectRiver(value) {
    this._controller.changeRivers(value);
  }

  selectLakes(value) {
    this._controller.changeLakes(value);
  }

  selectCoasts(value) {
    this._controller.changeCoasts(value);
  }

  private _getJson : GetJson;

  private _controller : Controller;
  private _model : Model;

  private viewportWidth : number;
  private viewportHeight : number;

  private uiLoader : Promise<Object>;
  public ui : UI;

  inCanvas : boolean ;
  inMenu : boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    var tabMenuRefHeight = this.climateSystemRef.nativeElement.parentNode.parentNode.children[0].clientHeight;
    //var componentWidth = this.climateSystemRef.nativeElement.width;

    this.climateSystemRef.nativeElement.height = window.innerHeight - tabMenuRefHeight;
    //this.menuRef.nativeElement.height = this.webglCanvasRef.nativeElement.clientHeight-10;
    //this.menuRef.nativeElement.height = this.climateSystemRef.nativeElement.height-10;
    jQuery('#ClimateSystem').height(jQuery(window).height() - jQuery('#TabMenu').height());
    var menu = jQuery('#Menu');
    menu.height(menu.parent().height()-10);
    var leftPad = menu.width();

    //this.tabMenuRowRef.nativeElement.height = window.innerHeight;

    jQuery('#WebglCanvas').height(jQuery('#WebglCanvas').parent().height());
    jQuery('#WebglCanvas').width(jQuery('#WebglCanvas').parent().width());

    this._canvas.nativeElement.height = this._canvas.nativeElement.parentNode.clientHeight;
    this._canvas.nativeElement.width = this._canvas.nativeElement.parentNode.clientWidth;//-leftPad;

    this.viewportHeight = this._canvas.nativeElement.height;
    this.viewportWidth = this._canvas.nativeElement.width;

    if (event != null) {
      this.ChangeWindowSize(this.viewportWidth, this.viewportHeight);
      this.drawScene(this.ui, this._model.settings);
    }
  }



  ngAfterViewInit(){

    //this.tabMenuRowRef.nativeElement.style.marginBottom = "0px";
    //jQuery('#tabMenuRow')[0].style.marginBottom = "0px";
    //jQuery('#ClimateSystem').height(jQuery(window).height()-jQuery('#tabMenu').height());
    //this.climateSystemRef.nativeElement.height = window.innerHeight - this.tabMenuRowRef.nativeElement.clientHeight;
    //jQuery('#ClimateSystem').height(jQuery(window).height()-this.tabMenuRowRef.nativeElement.clientHeight);

    jQuery('#WebglCanvas').height(jQuery('#WebglCanvas').parent().height());

    this.onResize(null);
    this.onResize(null);
    this.uiLoader.then( results => {
        this.webGLStart();
      }
    );
  }

  public setModel() {

  }

  public GetTitle() : string {
    if (this._model != null) {
      if (this._model.settings != null) {
        return this._model.settings.FullName;
      }
    }
    return "";
  }

  public GridBoxData : Array<number>;

  public GridboxSelected() : boolean{
    var value = false;
    if (this._model != null) {
      if (this._model.settings != null) {
        value = this._model.settings.CurrGridBoxId > 0 ? true : false;
        this.GridBoxData = new Array<number>(3);
        this.GridBoxData[0] = this._model.settings.CurrGridBoxValue;
        this.GridBoxData[1] = this._model.settings.CurrGridBoxLat;
        this.GridBoxData[2] = this._model.settings.CurrGridBoxLon;
      }
    }
    return value;
  }

  public DrawLegend() {
    if (this._model != null) {
      if (this._model.legend != null) {
        this._model.legend.drawLegend();
      }
    }
  }

  public GetLayerDateLabel() : string {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.LevelName != null && this._model.settings.CurrDate != null) {
          return this._model.settings.LevelName + " | " + this._model.settings.CurrDate;
        }
      }
   }
   return "";
  }

  public GetMinYear() : number {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.Dataset != null) {
          return Number(this._model.settings.Dataset.StartDate.substring(0, 4));
        }
      }
    }
    return null;
  }

  public GetMaxYear() : number {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.Dataset != null) {
          return Number(this._model.settings.Dataset.EndDate.substring(0, 4));
        }
      }
    }
    return null;
  }

  public GetMinMonth(): number {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.Dataset != null) {
          return Number(this._model.settings.Dataset.StartDate.substring(5, 7));
        }
      }
    }
    return null;
  }

  public GetMaxMonth(): number {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.Dataset != null) {
          return Number(this._model.settings.Dataset.EndDate.substring(5, 7));
        }
      }
    }
    return null;
  }

  public GetLevels() : any {
    if (this._model != null) {
      if (this._model.settings != null) {
        if (this._model.settings.Levels != null) {
          return this._model.settings.Levels;
        }
      }
    }
    return [];
  }

  /**
   * Takes the '|' separated list of datasets and creates a nested json of datasets out of it
   * Used the following as a starting port for this code:
   * https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
   * @param obj - The array we will be adding the keys to
   * @param keyPath - The keypath (as an array) we will be adding @param obj
   */
  public generateDatesetMenuItems(obj, keyPath) {
    const lastKeyIndex = keyPath.length;
    for (let i = 0; i < lastKeyIndex; ++ i) {
      const key = keyPath[i];
      let found_key = false;
      let key_location = -1;
      for (let j = 0; j < obj.length; j++) {
        if (obj[j].title === key) {
          found_key = true;
          key_location = j;
          break;
        }
      }
      if (!found_key) {
        obj.push({
          title: key,
          FullName: keyPath.slice(0, i + 1).join('|'),
          children: new Array<any>()
        });
        key_location = obj.length - 1;
      }
      obj = obj[key_location].children;
    }
  }

  OpenDatasetDialog() {

    let settings = new Array<any>();

    // Generate key/value lookup //
    for (let i = 0; i < this._model.settings.Datasets.length; i++) {
      const currFullName = this._model.settings.Datasets[i].FullName;
      const datasetPath = currFullName.split('|', -1);
      this.generateDatesetMenuItems(settings, datasetPath);
    }

    const dialogRef = this.dialog.open(DatasetMenu, {data: settings});
    dialogRef.afterClosed().subscribe(dataset => {

      const selectedDataset = this._model.settings.Datasets.find(myObj => myObj.FullName === dataset.FullName);
      if (selectedDataset != null) {
        this._controller.loadLevels(selectedDataset);
        this._controller.loadDataset(selectedDataset, selectedDataset.StartDate, 1);
        this.yearSlider = Number(selectedDataset.StartDate.substring(0, 4));
      }
    });
  }

  OpenTimeseriesDialog() {
    var timeseriesHeight = Math.floor(this.viewportHeight - this.viewportHeight*0.10) + "px";
    var timeseriesWidth = Math.floor(this.viewportWidth - this.viewportWidth*0.10) + "px";
    this._model.settings.viewportHeight = this.viewportHeight;
    this._model.settings.viewportWidth = this.viewportWidth;
    let dialogRef = this.dialog.open(TimeseriesMenu, {
      height: timeseriesHeight,
      data: this._model});
  }

  public yearSlider : number = 0;

  currMonth : string = '01';
  months = [
    {value: '01', viewValue: 'January'},
    {value: '02', viewValue: 'February'},
    {value: '03', viewValue: 'March'},
    {value: '04', viewValue: 'April'},
    {value: '05', viewValue: 'May'},
    {value: '06', viewValue: 'June'},
    {value: '07', viewValue: 'July'},
    {value: '08', viewValue: 'August'},
    {value: '09', viewValue: 'September'},
    {value: '10', viewValue: 'October'},
    {value: '11', viewValue: 'Novenmber'},
    {value: '12', viewValue: 'December'}
  ];

  ChangeMonth() {
    this._model.settings.CurrDate = Helpers.LeftPad(this.yearSlider, 4) + "-" + this.currMonth + "-01";
    this._controller.loadDataset(this._model.settings.Dataset, this._model.settings.CurrDate, this._model.settings.Level_ID);
  }

  ChangeYear() {
    if (this.yearSlider > this.GetMaxYear()) {
      this.yearSlider = this.GetMaxYear();
    } else if (this.yearSlider < this.GetMinYear()) {
      this.yearSlider = this.GetMinYear();
    }
    this._model.settings.CurrDate = Helpers.LeftPad(this.yearSlider, 4) + "-" + this._model.settings.CurrDate.substring(5, 10);
    this._controller.loadDataset(this._model.settings.Dataset, this._model.settings.CurrDate, this._model.settings.Level_ID);
  }

  ChangeLevel(level_id : number) {
    this._controller.loadDataset(this._model.settings.Dataset, this._model.settings.CurrDate, level_id);
  }

  OpenColorMapDialog() {
    let dialogRef = this.dialog.open(ColorMapMenu, {data: this._model.colorMap});
    dialogRef.afterClosed().subscribe(colorMap => {
      if (colorMap != null) {
        this._controller.ChangeColorMap(colorMap);
      }
    });
  }

  createCsvFromGriddedData() {
    var csvContent = "data:text/csv;charset=utf-8,";

    // Create the header
    csvContent += "Latitude,Longitude,Value\n";
    var rawData = this._model._world.GetRawData();
    if (rawData.Lat.length > 0) {
      for (var i = 0; i < rawData.Lat.length; i++) {
        var dataString = rawData.Lat[i] + "," + rawData.Lon[i] + "," + rawData.ValueFinal[i];
        csvContent += dataString + "\n";
      }

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", this._model.settings.Dataset.DatabaseStore + "_GridData_" + this._model.settings.CurrDate + ".csv");
      link.click();
    }
  }


  constructor(getJson : GetJson, public dialog: MdDialog) {
    this.inCanvas = false;
    this.inMenu = false;
    this._getJson = getJson;

    this.viewportWidth = 500;
    this.viewportHeight = 500;

    this.uiLoader = this._getJson.getAll('./assets/menuOptions.json');

    this.mvMatrixStack = new Array();
    this.globeBumpMap = new WebGLTextureEnh();

    // Initialize matrices
    this.lightDirection = GlMatrix.vec3.create();
    this.mvMatrix = GlMatrix.mat4.create();
    this.vMatrix = GlMatrix.mat4.create();
    this.pMatrix = GlMatrix.mat4.create();
    this.mvMatrixForVec = GlMatrix.mat4.create();
    this.lastPositionMatrix = GlMatrix.mat4.create();
    this.earthRotationMatrix = GlMatrix.mat4.create();
    this.earthRotationMatrix_x = GlMatrix.mat4.create();
    this.earthRotationMatrix_y = GlMatrix.mat4.create();

    GlMatrix.mat4.identity(this.earthRotationMatrix);
    GlMatrix.mat4.identity(this.earthRotationMatrix_x);
    GlMatrix.mat4.identity(this.earthRotationMatrix_y);


    this.Shaders = new Shaders();

    // Start


  }


  /*public constructor(controller : Controller, model : Model, getJson : GetJson) {
    this._model = model;
    this._model.RegisterObserver(this);
    this._controller = controller;


  }*/

  public GL : WebGLRenderingContext;

  lightDirection : number[];
  mvMatrix : number[];
  vMatrix : number[];
  pMatrix : number[];
  mvMatrixForVec : number[];
  lastPositionMatrix : number[];
  earthRotationMatrix : number[];
  earthRotationMatrix_x : number[];
  earthRotationMatrix_y : number[];

  mvMatrixStack : any [];
  vMatrixStack : any [];
  globeBumpMap : WebGLTextureEnh;

  public Shaders : Shaders;

  webGLStart() {
    this.initGL();
    this.uiLoader.then(results => {
        //while (true) {
          this.tick();
        //}
      }
    );

  }

  private _finishedLoading : boolean = false;
  title: string;

  @HostListener('mousewheel', ['$event']) wheel1(event) {
    this.onMousewheel(event);
  }


  @HostListener('wheel', ['$event']) wheel2(event) {
    this.onMousewheel(event);
  }


  private onMousewheel(event) {
    if (this._finishedLoading && this.inCanvas) {
      this.ui.handleMouseWheel(this._model.settings.globeView, event);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    if (this._finishedLoading && this.inCanvas) {
      this.ui.handleMouseDown(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event) {
    if (this._finishedLoading && this.inCanvas) {

      var rotationMatrix = {
        earthRotationMatrix : this.earthRotationMatrix,
        earthRotationMatrix_x : this.earthRotationMatrix_x,
        earthRotationMatrix_y : this.earthRotationMatrix_y
      };
      var results = this.ui.handleMouseMove(rotationMatrix, this._model.settings.globeView, event);
      this.earthRotationMatrix = results.earthRotationMatrix;
      this.earthRotationMatrix_x = results.earthRotationMatrix_x;
      this.earthRotationMatrix_y = results.earthRotationMatrix_y;
    }
  }

  onCanvas() {
    this.inCanvas = true;
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    if (this._finishedLoading && this.inCanvas) {
      this.ui.handleMouseUp(this._model._world, this.GL, this._model.settings.globeView, this.pMatrix, this.mvMatrix, this.vMatrix, this.earthRotationMatrix, this.earthRotationMatrix_x, this.earthRotationMatrix_y, event);
    }
  }

  /**
   * Initialize the OpenGL instance
   * @param canvas
   */
  initGL () {
    // UI
    this.uiLoader.then( result => {
        this.ui = new UI(this._model.settings, result);
        this._finishedLoading = true;
      });

    this.GL = this._canvas.nativeElement.getContext("experimental-webgl");
    this.viewportWidth = this._canvas.nativeElement.width;
    this.viewportHeight = this._canvas.nativeElement.height;

    this.initShaders();
    //this.initTextures('./assets/earth_normalmap_flat_8192x4096.jpg');

    this._model = new Model(this.GL, this._getJson);
    this._model.RegisterObserver(this);
    GlMatrix.vec3.normalize(this._model.settings.lightDirection, [-1.0, 0.0, 0.0]);


    this._controller = new Controller(this._model, this);
    this.selectCoasts(this.viewSettingsSelected.coasts);
    this.selectRiver(this.viewSettingsSelected.rivers);
    this.selectLakes(this.viewSettingsSelected.lakes);

    this._controller.changeLatLon(this.viewSettingsSelected.latlonlines);
    this._controller.changeMinorIslandsLines(this.viewSettingsSelected.minorIslands);

    //this._controller.loadDataset("mrsharky_jp_Mon_gaus_mono_air_sfc_mon_mean", "0001-01-01", "1");
    //this._controller.loadDataset("mrsharky_noaa20v2c_Mon_press_air_mon_mean", "1851-01-01", "1");


    if (!this.GL) {
      alert("Could not initialise WebGL, sorry :-(");
    }
  }


  getShader (id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.getAttribute("type") == "x-shader/x-fragment") {
      shader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
    } else if (shaderScript.getAttribute("type") == "x-shader/x-vertex") {
      shader = this.GL.createShader(this.GL.VERTEX_SHADER);
    } else {
      return null;
    }
    /*if (shaderScript.type == "x-shader/x-fragment") {
     shader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
     } else if (shaderScript.type == "x-shader/x-vertex") {
     shader = this.GL.createShader(this.GL.VERTEX_SHADER);
     } else {
     return null;
     }*/

    this.GL.shaderSource(shader, str);
    this.GL.compileShader(shader);

    if (!this.GL.getShaderParameter(shader, this.GL.COMPILE_STATUS)) {
      alert(this.GL.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  /**
   * Initialize the shaders
   */
  initShaders () {
    // World Shader
    {
      var fragmentShader = this.getShader("shader-fs");
      var vertexShader = this.getShader("shader-vs");

      this.Shaders.worldShader.program = this.GL.createProgram();
      this.GL.attachShader(this.Shaders.worldShader.program, vertexShader);
      this.GL.attachShader(this.Shaders.worldShader.program, fragmentShader);
      this.GL.linkProgram(this.Shaders.worldShader.program);

      if (!this.GL.getProgramParameter(this.Shaders.worldShader.program, this.GL.LINK_STATUS)) {
        alert("Could not initialise shaders");
      }

      this.GL.useProgram(this.Shaders.worldShader.program);

      this.Shaders.worldShader.vertexPositionAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aVertexPosition");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.vertexPositionAttribute);

      this.Shaders.worldShader.vertexNormalAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aVertexNormal");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.vertexNormalAttribute);

      this.Shaders.worldShader.vertexTangentAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aVertexTangent");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.vertexTangentAttribute);

      this.Shaders.worldShader.vertexBiTangentAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aVertexBiTangent");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.vertexBiTangentAttribute);

      this.Shaders.worldShader.vertexColorAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aVertexColor");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.vertexColorAttribute);

      this.Shaders.worldShader.textureCoordAttribute = this.GL.getAttribLocation(this.Shaders.worldShader.program, "aTextureCoord");
      this.GL.enableVertexAttribArray(this.Shaders.worldShader.textureCoordAttribute);

      this.Shaders.worldShader.pMatrixUniform     = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uPMatrix");
      this.Shaders.worldShader.mvMatrixUniform    = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uMVMatrix");
      this.Shaders.worldShader.samplerUniform     = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uSampler");
      this.Shaders.worldShader.useLightingUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uUseLighting");

      this.Shaders.worldShader.ambientColorUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uAmbientColor");
      this.Shaders.worldShader.lightDirectionUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uLightingDirection");
      this.Shaders.worldShader.directionalColorUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uDirectionalColor");

      this.Shaders.worldShader.nMatrixUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uNMatrix");
      this.Shaders.worldShader.vMatrixUniform = this.GL.getUniformLocation(this.Shaders.worldShader.program, "uVMatrix");
    }
  }




  initTextures (texture) {
    this.globeBumpMap.texture = this.GL.createTexture();
    this.globeBumpMap.image = new Image();
    this.globeBumpMap.image.src = texture;

    this.globeBumpMap.image.onload = () => {
      this.handleLoadedTexture(this.globeBumpMap);
    };
  }

  handleLoadedTexture (webglTxEnh: WebGLTextureEnh) {
    this.GL.bindTexture(this.GL.TEXTURE_2D, webglTxEnh.texture);
    this.GL.pixelStorei(this.GL.UNPACK_FLIP_Y_WEBGL, true);
    this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, webglTxEnh.image);
    this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.LINEAR);
    this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);
    this.GL.bindTexture(this.GL.TEXTURE_2D, null);
  }

  public ChangeWindowSize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  // Methods
  public initBuffers(RawData) {
    // Create the lat/lon lines
    this._model._lines.latLonBuffers();

    // Create the coastline Buffers
    //this._model._lines.allLineBuffers(null,null,null,null,null,null);
    this._model._lines.processAllLineData();

    // Create the world (globe) buffers
    if (RawData != null) {
      this._model._world.worldBuffers(RawData);
    }

    // Draw the legend
    if (RawData != null) {
      if (RawData.Lat.length > 0) {
        //this._colorMap.drawLegend();
      }
    }
  }




  /**
   * Provides requestAnimationFrame in a cross browser way.
   */
  requestAnimFrame(callback : Function) {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        window.setTimeout(callback, 1000/60);
      };
  };

  tick() {
    requestAnimationFrame(result => this.tick());
    this.drawScene(this.ui, this._model.settings);
  }

  mvPushMatrix() {
    var copy = GlMatrix.mat4.create();
    GlMatrix.mat4.copy(copy, this.mvMatrix);
    this.mvMatrixStack.push(copy);
  }

  mvPopMatrix() {
    if (this.mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
  }

  setMatrixUniforms (shader : WebGLProgramEnh, settings) {
    this.GL.uniformMatrix4fv(shader.pMatrixUniform, false, this.pMatrix);
    this.GL.uniformMatrix4fv(shader.mvMatrixUniform, false, this.mvMatrix);
    this.GL.uniformMatrix4fv(shader.vMatrixUniform, false, this.vMatrix);

    this.GL.uniform1i(shader.useLightingUniform, settings.lightingEnabled);
    this.GL.uniform3fv(shader.ambientColorUniform, settings.lightAmbient);
    this.GL.uniform3fv(shader.lightDirectionUniform, this.lightDirection);
    this.GL.uniform3fv(shader.directionalColorUniform, settings.lightDirectionColor);
  }

  setMatrixLightingUniforms(shader : WebGLProgramEnh) {
    // Lighting related
    var normalMatrix = GlMatrix.mat3.create();
    GlMatrix.mat4.toMat3(normalMatrix, this.mvMatrix);
    GlMatrix.mat3.invert(normalMatrix, normalMatrix);
    GlMatrix.mat3.transpose(normalMatrix, normalMatrix);
    this.GL.uniformMatrix3fv(shader.nMatrixUniform, false, normalMatrix);
  }

  SetAllGlBuffers(shader : WebGLProgramEnh, vertex, glElementType, settings : Settings) {
    this.GL.useProgram(shader.program);
    this.setMatrixLightingUniforms(shader);
    for (var i = 0; i < vertex.PositionBuffer.length; i++) {
      // Texture
      this.GL.activeTexture(this.GL.TEXTURE0);
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.globeBumpMap.texture);
      this.GL.uniform1i(shader.samplerUniform, 0);

      // Position
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.PositionBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.vertexPositionAttribute, vertex.PositionBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // Color
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.ColorBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.vertexColorAttribute, vertex.ColorBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // Normal
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.NormalBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.vertexNormalAttribute, vertex.NormalBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // Tangent
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.TangentBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.vertexTangentAttribute, vertex.TangentBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // BiTangent
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.BiTangentBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.vertexBiTangentAttribute, vertex.BiTangentBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // Texture Coord
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, vertex.TextureCoordBuffer[i].buffer);
      this.GL.vertexAttribPointer(shader.textureCoordAttribute, vertex.TextureCoordBuffer[i].itemSize, this.GL.FLOAT, false, 0, 0);

      // Index
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, vertex.IndexBuffer[i].buffer);
      this.setMatrixUniforms(shader, settings);
      this.GL.drawElements(glElementType, vertex.IndexBuffer[i].numItems, this.GL.UNSIGNED_SHORT, 0);
    }
  }

  drawScene(UI, settings) {

    this.GL.viewport(0, 0, this.GL.canvas.width, this.GL.canvas.height);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.GL.clearColor(1.0, 1.0, 1.0, 1.0);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT);
    this.GL.enable(this.GL.CULL_FACE);
    this.GL.cullFace(this.GL.BACK);
    this.GL.enable(this.GL.DEPTH_TEST);

    GlMatrix.mat4.identity(this.mvMatrix);
    this.mvPushMatrix();
    var xMovementCenter = 0;
    if (settings.pacificCenter && settings.globeView == GlobeViewType.TwoDim) {
      xMovementCenter = -180;
    }
    var widthToHeight = this.GL.canvas.width / this.GL.canvas.height;

    if (settings.globeView == GlobeViewType.ThreeDim || settings.globeView == GlobeViewType.TwoDim) {
      //GlMatrix.mat4.perspective(this.pMatrix, 45, widthToHeight, 0.1, -1000);
      GlMatrix.mat4.perspective(this.pMatrix, 45, widthToHeight, 0.1, 1000);
      //GlMatrix.mat4.perspective(this.pMatrix, 45, widthToHeight, 0.1, UI.globeDistance + UI.zoomLevel );
      GlMatrix.mat4.translate(this.mvMatrix, this.mvMatrix, [UI.xMovement + xMovementCenter, UI.yMovement, UI.globeDistance + UI.zoomLevel]);
    } else if (settings.globeView == GlobeViewType.Ortho) {
      var orthoZoom = -1 * UI.zoomLevel / (80.0 * 2.0);
      GlMatrix.mat4.ortho(this.pMatrix, (-widthToHeight * 80) * orthoZoom, (widthToHeight * 80) * orthoZoom
        , (-1 * 80) * orthoZoom, (1 * 80) * orthoZoom, -1000, 1000.0);
      GlMatrix.mat4.translate(this.mvMatrix, this.mvMatrix, [UI.xMovement + xMovementCenter, UI.yMovement, -1000.0]);
    }

    GlMatrix.mat4.multiply(this.mvMatrix, this.mvMatrix, this.earthRotationMatrix);

    // lighting
    this.lightDirection = GlMatrix.vec3.clone(settings.lightDirection);

    //mat4.multiplyVec3(Gl.lightDirection, mvMatrix, Gl.lightDirection);

    //mat4.multiply(displaySettings.lightDirection, displaySettings.lightDirection, earthRotationMatrix);
    if (settings.globeView == GlobeViewType.ThreeDim || settings.globeView == GlobeViewType.Ortho) {
      GlMatrix.mat4.rotate(this.mvMatrix, this.mvMatrix, Helpers.degToRad(-90), [1, 0, 0]);

      //mat4.multiplyVec3(displaySettings.lightDirection, mvMatrix, displaySettings.lightDirection);

      //mat4.rotate(displaySettings.lightDirection, displaySettings.lightDirection, degToRad(-90), [1, 0, 0]);
    }

    // the globe
    GlMatrix.mat4.copy(this.vMatrix, this.mvMatrix);
    this.mvPushMatrix();
    if (this._model.hasOwnProperty("_world")) {
      if (this._model._world.WorldVertex.hasOwnProperty("PositionBuffer")) {
        if (this._model._world.WorldVertex.PositionBuffer.length > 0) {
          this.SetAllGlBuffers(this.Shaders.worldShader, this._model._world.WorldVertex, this.GL.TRIANGLES, settings);
        }
      }
    }
    this.mvPopMatrix();


    if (this._model.hasOwnProperty("_lines")) {

      // LatLon Line Data
      this.processLineData(this._model._lines.LatLonVertex, settings);

      // Coasts Line Data
      this.processLineData(this._model._lines.CoastsVertex, settings);


      // Lakes Line Data
      this.processLineData(this._model._lines.LakesVertex, settings);

      // Rivers Line Data
      this.processLineData(this._model._lines.RiversVertex, settings);

      // Geo Line Data
      this.processLineData(this._model._lines.GeoLinesVertex, settings);

      // Timezone Line Data
      this.processLineData(this._model._lines.TimeZonesVertex, settings);

      // Minor Islands Line Data
      this.processLineData(this._model._lines.MinorIslandsVertex, settings);
    }
  }

  private processLineData(input, settings) {
    this.mvPushMatrix();
    if (input.hasOwnProperty("PositionBuffer")) {
      if (input.PositionBuffer.length > 0) {
        this.SetAllGlBuffers(this.Shaders.worldShader, input, this.GL.LINES, settings);
      }
    }
    this.mvPopMatrix();
  }

}
