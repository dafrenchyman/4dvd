/**
 * Created by dafre on 5/11/2017.
 */

import {Helpers} from "./helpers";
import {LineVertex} from "./lineVertex";
import {GlobeViewType, Settings} from "./settings";
import {GlBuffer} from "./gl";
import {ColorMap} from "./ColorMap";

export class Lines {

  // Variables
  latLinesVertexPositionBuffer : any[];
  latLinesVertexColorBuffer : any[];
  lonLinesVertexPositionBuffer : any[];
  lonLinesVertexColorBuffer : any[];
  currDegreeStep : number;
  LineVertex : LineVertex;

  CoastsVertex : LineVertex;
  LatLonVertex : LineVertex;
  MinorIslandsVertex : LineVertex;
  LakesVertex : LineVertex;
  RiversVertex : LineVertex;
  GeoLinesVertex : LineVertex;
  TimeZonesVertex : LineVertex;

  private _settings : Settings;
  private _gl : WebGLRenderingContext;
  private _colorMap : ColorMap;

  public constructor(gl : WebGLRenderingContext, settings: Settings, colorMap : ColorMap) {
    this._settings = settings;
    this._gl = gl;
    this._colorMap = colorMap;
    this.currDegreeStep = 10;

    this.LineVertex = new LineVertex();
    this.CoastsVertex = new LineVertex();
    this.LatLonVertex = new LineVertex();
    this.MinorIslandsVertex = new LineVertex();
    this.LakesVertex = new LineVertex();
    this.RiversVertex = new LineVertex();
    this.GeoLinesVertex = new LineVertex();
    this.TimeZonesVertex = new LineVertex();
  }

  // Methods

  CreateLatLonGridLines (lonDegreeStep, latDegreeStep) {
    var latLinesData = {Lat: [], Lon: []};
    var visualStep = 1.0;

    // Vertical Lines
    var latStart = -90;
    var latEnd = 90;
    var lonStart = -180;
    var lonEnd = 180;
    latLinesData.Lat.push(null);
    latLinesData.Lon.push(null);
    // Vertical Lines
    for (var lonCounter = 0; lonCounter <= (lonEnd-lonStart)/lonDegreeStep; lonCounter++)
    {
      var curLon = lonStart + lonCounter * lonDegreeStep;
      for (var latCounter = 0; latCounter <= (latEnd-latStart)/visualStep; latCounter++)
      {
        var curLat = latStart + latCounter * visualStep;

        latLinesData.Lat.push(curLat);
        latLinesData.Lon.push(curLon);
      }
      latLinesData.Lat.push(null);
      latLinesData.Lon.push(null);
    }
    // Horizontal Lines
    for (var latCounter = 0; latCounter <= (latEnd-latStart)/latDegreeStep; latCounter++)
    {
      var curLat = latStart + latCounter * latDegreeStep;
      for (var lonCounter = 0; lonCounter <= (lonEnd-lonStart)/visualStep; lonCounter++)
      {
        var curLon = lonStart + lonCounter * visualStep;

        latLinesData.Lat.push(curLat);
        latLinesData.Lon.push(curLon);
      }
      latLinesData.Lat.push(null);
      latLinesData.Lon.push(null);
    }
    return latLinesData;
  }

  submitDataForLines (SubData, color) {
    var dataLon = SubData.Lon;
    var dataLat = SubData.Lat;
    // Zero out final buffers
    var PositionBuffer = [];
    var ColorBuffer = [];
    var NormalBuffer = [];
    var TangentBuffer = [];
    var BiTangentBuffer = [];
    var TextureBuffer = [];
    var IndexBuffer = [];

    var linePositionData = [];
    var lineColorData = [];
    var lineNormalData = [];
    var lineTangentData = [];
    var lineBiTangentData = [];
    var lineTextureData = [];
    var lineIndexData = [];

    var prevLon;

    var currLineIndexData = [];
    var counter = 0;
    for (var i = 0; i < dataLat.length; i++) {
      // if our current entry is null, it means it's the start of a new array
      if (dataLat[i] == null ) {
        // if we're not on the first entry, and we've hit a null, then we need the put the last "coast" into buffer
        if (i != 0) {
          for (var j = 1; j < currLineIndexData.length; j++)
          {
            lineIndexData.push(currLineIndexData[j-1]);
            lineIndexData.push(currLineIndexData[j]);
          }
        }

        // Index
        currLineIndexData = [];
        i++;
      }

      // if we hit the 16 bit ceiling for indexes (or the last element
      if ( (i != 0 && counter / (Math.pow(2,16)-2000) > 1.0) || i == dataLat.length -2 )
      {
        counter = 0;
        for (var j = 1; j < currLineIndexData.length; j++)
        {
          lineIndexData.push(currLineIndexData[j-1]);
          lineIndexData.push(currLineIndexData[j]);
        }

        // Position
        var currLineVertexPositionBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexPositionBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(linePositionData), this._gl.STATIC_DRAW);
        currLineVertexPositionBuffer.itemSize = 3;
        currLineVertexPositionBuffer.numItems = linePositionData.length / 3;
        PositionBuffer.push(currLineVertexPositionBuffer);

        // Color
        var currLineVertexColorBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexColorBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(lineColorData), this._gl.STATIC_DRAW);
        currLineVertexColorBuffer.itemSize = 4;
        currLineVertexColorBuffer.numItems = lineColorData.length / 4;
        ColorBuffer.push(currLineVertexColorBuffer);

        // Normal
        var currLineVertexNormalBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexNormalBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(lineNormalData), this._gl.STATIC_DRAW);
        currLineVertexNormalBuffer.itemSize = 3;
        currLineVertexNormalBuffer.numItems = lineNormalData.length / 3;
        NormalBuffer.push(currLineVertexNormalBuffer);

        // Tangent
        var currLineVertexTangentBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexTangentBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(lineTangentData), this._gl.STATIC_DRAW);
        currLineVertexTangentBuffer.itemSize = 3;
        currLineVertexTangentBuffer.numItems = lineTangentData.length / 3;
        TangentBuffer.push(currLineVertexTangentBuffer);

        // BiTangent
        var currLineVertexBiTangentBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexBiTangentBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(lineBiTangentData), this._gl.STATIC_DRAW);
        currLineVertexBiTangentBuffer.itemSize = 3;
        currLineVertexBiTangentBuffer.numItems = lineBiTangentData.length / 3;
        BiTangentBuffer.push(currLineVertexBiTangentBuffer);

        // Texture
        var currLineVertexTextureBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLineVertexTextureBuffer.buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(lineTextureData), this._gl.STATIC_DRAW);
        currLineVertexTextureBuffer.itemSize = 2;
        currLineVertexTextureBuffer.numItems = lineTextureData.length / 2;
        TextureBuffer.push(currLineVertexTextureBuffer);

        // Index
        var currLineVertexIndexBuffer = new GlBuffer(this._gl);
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, currLineVertexIndexBuffer.buffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIndexData), this._gl.STATIC_DRAW);
        currLineVertexIndexBuffer.itemSize = 1;
        currLineVertexIndexBuffer.numItems = lineIndexData.length;
        IndexBuffer.push(currLineVertexIndexBuffer);

        // Index
        currLineIndexData = [];
        linePositionData = [];
        lineColorData = [];
        lineNormalData = [];
        lineTangentData = [];
        lineBiTangentData = [];
        lineTextureData = [];
        lineIndexData = [];
        //i++;
      }

      var curLon = dataLon[i];
      var curLat = dataLat[i];

      // if we've gone over the bounds of the map (2D) we need to add new end pieces and indexes
      if (this._settings.globeView == GlobeViewType.TwoDim)
      {
        var lonMax = this._settings.pacificCenter ? 360.0 : 180;
        var lonMin = this._settings.pacificCenter ? 0.0 : -180;

        if (this._settings.pacificCenter) {
          if (curLon < 0) {
            curLon = curLon + 360.0;
          }
        }

        var currCoordinates = {
          coordinates: {x: curLon, y: curLat, z: 0.25},
          normals: {x: 0, y: 0, z: 1},
          u: (curLon + 180.0)/360,
          v: (curLat + 90.0)/180,
          tangents: {x: 1, y: 0, z: 0},
          biTangents: {x: 0, y: 1, z: 0}};

        var passBounds = false;
        if (i == 0) {
          prevLon = curLon;
        }

        if (Math.abs(curLon - prevLon) > 300 && currLineIndexData.length > 0) {
          if (prevLon < curLon) {
            currCoordinates.coordinates.x = lonMin;
          } else if (prevLon > curLon) {
            currCoordinates.coordinates.x = lonMax;
          }
          passBounds = true;
        }

        if (passBounds) {
          // Spherical World Positions
          linePositionData.push(currCoordinates.coordinates.x);			// X
          linePositionData.push(currCoordinates.coordinates.y);			// Y
          linePositionData.push(currCoordinates.coordinates.z);			// Z

          // Normal
          lineNormalData.push(currCoordinates.normals.x);
          lineNormalData.push(currCoordinates.normals.y);
          lineNormalData.push(currCoordinates.normals.z);

          // Tangent
          lineTangentData.push(currCoordinates.tangents.x);
          lineTangentData.push(currCoordinates.tangents.y);
          lineTangentData.push(currCoordinates.tangents.z);

          // BiTangent
          lineBiTangentData.push(currCoordinates.biTangents.x);
          lineBiTangentData.push(currCoordinates.biTangents.y);
          lineBiTangentData.push(currCoordinates.biTangents.z);

          // Texture
          lineTextureData.push(currCoordinates.u);
          lineTextureData.push(currCoordinates.v);

          // Color
          lineColorData.push(color[0]);					// R
          lineColorData.push(color[1]);					// G
          lineColorData.push(color[2]);					// B
          lineColorData.push(color[3]);					// O

          currLineIndexData.push(counter);

          for (var j = 1; j < currLineIndexData.length; j++) {
            lineIndexData.push(currLineIndexData[j-1]);
            lineIndexData.push(currLineIndexData[j]);
          }

          // Index
          currLineIndexData = [];
          prevLon = curLon;
          counter++;
        }
      }

      var currCoordinates = {
        coordinates: {x: curLon, y: curLat, z: 0.25},
        normals: {x: 0, y: 0, z: 1},
        u: (curLon + 180.0)/360,
        v: (curLat + 90.0)/180,
        tangents: {x: 1, y: 0, z: 0},
        biTangents: {x: 0, y: 1, z: 0}};
      if (this._settings.globeView == GlobeViewType.ThreeDim || this._settings.globeView == GlobeViewType.Ortho) {
        var newCurrCoordinates = Helpers.cartesianToSphere(curLon * (Math.PI / 180.0),
          curLat * (Math.PI / 180.0),
          this._settings.EarthRadius + 0.01);
        currCoordinates.biTangents = newCurrCoordinates.biTangents;
        currCoordinates.coordinates = newCurrCoordinates.coordinates;
        currCoordinates.normals = newCurrCoordinates.normals;
        currCoordinates.tangents = newCurrCoordinates.tangents;
      }

      // Spherical World Positions
      linePositionData.push(currCoordinates.coordinates.x);			// X
      linePositionData.push(currCoordinates.coordinates.y);			// Y
      linePositionData.push(currCoordinates.coordinates.z);			// Z

      // Normal
      lineNormalData.push(currCoordinates.normals.x);
      lineNormalData.push(currCoordinates.normals.y);
      lineNormalData.push(currCoordinates.normals.z);

      // Tangent
      lineTangentData.push(currCoordinates.tangents.x);
      lineTangentData.push(currCoordinates.tangents.y);
      lineTangentData.push(currCoordinates.tangents.z);

      // BiTangent
      lineBiTangentData.push(currCoordinates.biTangents.x);
      lineBiTangentData.push(currCoordinates.biTangents.y);
      lineBiTangentData.push(currCoordinates.biTangents.z);

      // Texture
      lineTextureData.push(currCoordinates.u);
      lineTextureData.push(currCoordinates.v);

      // Color
      lineColorData.push(color[0]);					// R
      lineColorData.push(color[1]);					// G
      lineColorData.push(color[2]);					// B
      lineColorData.push(color[3]);					// O

      currLineIndexData.push(counter);
      prevLon = curLon;
      counter++;
    }

    return {
      position: PositionBuffer,
      index: IndexBuffer,
      color: ColorBuffer,
      normal: NormalBuffer,
      tangent: TangentBuffer,
      biTangent: BiTangentBuffer,
      texture: TextureBuffer
    };
  }

  latLonBuffers () {
    this.latLinesVertexPositionBuffer = [];
    this.latLinesVertexColorBuffer = [];
    this.lonLinesVertexPositionBuffer = [];
    this.lonLinesVertexColorBuffer = [];

    var degreeStep = this.currDegreeStep;
    var visualStep = 2.5;
    // Lat lines
    for (var latCounter = 0; latCounter < 180/degreeStep; latCounter++)
    {
      var curLat = latCounter * degreeStep - 90.0;
      var currLatLinesVertexPositionData = [];
      var currLatLinesVertexColorData = [];
      for (lonCounter = 0; lonCounter <= 360/visualStep; lonCounter++)
      {
        var curLon = (lonCounter * visualStep) - (this._settings.pacificCenter == true ? 0: 180);
        var currCoordinates = {x: curLon, y: curLat, z: 2.0};
        if (this._settings.globeView == GlobeViewType.ThreeDim || this._settings.globeView == GlobeViewType.Ortho) {
          currCoordinates = Helpers.cartesianToSphere(curLon * (Math.PI / 180.0),
            curLat * (Math.PI / 180.0),
            this._settings.EarthRadius + 0.05).coordinates;
        }

        // Spherical World Positions
        currLatLinesVertexPositionData.push(currCoordinates.x);			// X
        currLatLinesVertexPositionData.push(currCoordinates.y);			// Y
        currLatLinesVertexPositionData.push(currCoordinates.z);			// Z

        // Color
        currLatLinesVertexColorData.push(0.4);					// R
        currLatLinesVertexColorData.push(0.4);					// G
        currLatLinesVertexColorData.push(0.4);					// B
        currLatLinesVertexColorData.push(1.0);					// O
      }

      // Position
      var currLatLinesVertexPositionBuffer = new GlBuffer(this._gl);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLatLinesVertexPositionBuffer.buffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(currLatLinesVertexPositionData), this._gl.STATIC_DRAW);
      currLatLinesVertexPositionBuffer.itemSize = 3;
      currLatLinesVertexPositionBuffer.numItems = currLatLinesVertexPositionData.length/3;
      this.latLinesVertexPositionBuffer.push(currLatLinesVertexPositionBuffer);

      // Color
      var currLatLinesVertexColorBuffer = new GlBuffer(this._gl);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLatLinesVertexColorBuffer.buffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(currLatLinesVertexColorData), this._gl.STATIC_DRAW);
      currLatLinesVertexColorBuffer.itemSize = 4;
      currLatLinesVertexColorBuffer.numItems = currLatLinesVertexColorData.length/4;
      this.latLinesVertexColorBuffer.push(currLatLinesVertexColorBuffer);
    }

    for (var lonCounter = 0; lonCounter < 360/degreeStep; lonCounter++)
    {
      curLon = lonCounter * degreeStep;
      var currLonLinesVertexPositionData = [];
      var currLonLinesVertexColorData = [];
      for (latCounter = 0; latCounter <= 360/visualStep; latCounter++)
      {
        curLat = latCounter * visualStep;

        var currCoordinates = {x: curLon-180, y: curLat-90, z: 2.0};
        if (this._settings.globeView == GlobeViewType.ThreeDim || this._settings.globeView == GlobeViewType.Ortho) {
          currCoordinates = Helpers.cartesianToSphere(curLon * (Math.PI / 180.0),
            curLat * (Math.PI / 180.0),
            this._settings.EarthRadius + 0.05).coordinates;
        }

        // Spherical World Positions
        currLonLinesVertexPositionData.push(currCoordinates.x);			// X
        currLonLinesVertexPositionData.push(currCoordinates.y);			// Y
        currLonLinesVertexPositionData.push(currCoordinates.z);			// Z

        // Color
        currLonLinesVertexColorData.push(0.4);					// R
        currLonLinesVertexColorData.push(0.4);					// G
        currLonLinesVertexColorData.push(0.4);					// B
        currLonLinesVertexColorData.push(1.0);					// O
      }

      // Position
      var currLonLinesVertexPositionBuffer = new GlBuffer(this._gl);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLonLinesVertexPositionBuffer.buffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(currLonLinesVertexPositionData), this._gl.STATIC_DRAW);
      currLonLinesVertexPositionBuffer.itemSize = 3;
      currLonLinesVertexPositionBuffer.numItems = currLonLinesVertexPositionData.length/3;
      this.lonLinesVertexPositionBuffer.push(currLonLinesVertexPositionBuffer);

      // Color
      var currLonLinesVertexColorBuffer = new GlBuffer(this._gl);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, currLonLinesVertexColorBuffer.buffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(currLonLinesVertexColorData), this._gl.STATIC_DRAW);
      currLonLinesVertexColorBuffer.itemSize = 4;
      currLonLinesVertexColorBuffer.numItems = currLonLinesVertexColorData.length/4;
      this.lonLinesVertexColorBuffer.push(currLonLinesVertexColorBuffer);
    }
  }

  generateLineVertex (rawData, color) {
    var proccessedData = this.submitDataForLines(rawData, color);
    this.LineVertex.PositionBuffer     = this.LineVertex.PositionBuffer.concat(proccessedData.position);
    this.LineVertex.ColorBuffer        = this.LineVertex.ColorBuffer.concat(proccessedData.color);
    this.LineVertex.IndexBuffer        = this.LineVertex.IndexBuffer.concat(proccessedData.index);
    this.LineVertex.NormalBuffer       = this.LineVertex.NormalBuffer.concat(proccessedData.normal);
    this.LineVertex.TangentBuffer      = this.LineVertex.TangentBuffer.concat(proccessedData.tangent);
    this.LineVertex.BiTangentBuffer    = this.LineVertex.BiTangentBuffer.concat(proccessedData.biTangent);
    this.LineVertex.TextureCoordBuffer = this.LineVertex.TextureCoordBuffer.concat(proccessedData.texture);
  }

  generateLineVertexSpecific (rawData, color) : LineVertex {
    var proccessedData = this.submitDataForLines(rawData, color);
    var currVertex = new LineVertex();
    currVertex.PositionBuffer     = proccessedData.position;
    currVertex.ColorBuffer        = proccessedData.color;
    currVertex.IndexBuffer        = proccessedData.index;
    currVertex.NormalBuffer       = proccessedData.normal;
    currVertex.TangentBuffer      = proccessedData.tangent;
    currVertex.BiTangentBuffer    = proccessedData.biTangent;
    currVertex.TextureCoordBuffer = proccessedData.texture;
    return currVertex;
  }

  processAllLineData() {
    this.processCoasts();
    this.processGeolines();
    this.processLakes();
    this.processLatLon();
    this.processMinorIslands();
    this.processRivers();
    this.processTimezone();
  }

  // ***********************************************************
  // Rivers
  // ***********************************************************
  private riversData : any;

  riversBuffers(rivers) {
    if (this._settings.rivers && rivers.Lat.length > 0) {
      this.riversData = rivers;
      this.processRivers();
    }
  }

  processRivers() {
    if (this._settings.rivers && this.riversData.hasOwnProperty("Lat")) {
      this.RiversVertex = this.generateLineVertexSpecific(this.riversData, [0.45, 0.45, 0.45, 1.0]);
    }
  }

  clearRiversBuffers() {
    this.RiversVertex = new LineVertex();
  }

  // ***********************************************************
  // Lakes
  // ***********************************************************
  private lakesData : any;
  lakesBuffers(lakes) {
    if (this._settings.lakes && lakes.Lat.length > 0) {
      this.lakesData = lakes;
      this.processLakes();
    }
  }

  processLakes() {
    if (this._settings.lakes && this.lakesData.hasOwnProperty("Lat")) {
      this.LakesVertex = this.generateLineVertexSpecific(this.lakesData, [0.45, 0.45, 0.45, 1.0]);
    }
  }

  clearLakesBuffers() {
    this.LakesVertex = new LineVertex();
  }

  // ***********************************************************
  // Coasts
  // ***********************************************************
  private coastsData : any;

  coastsBuffers(coasts) {
    if (this._settings.coasts && coasts.Lat.length > 0) {
      this.coastsData = coasts;
      this.processCoasts();
    }
  }

  processCoasts() {
    if (this._settings.coasts && this.coastsData.hasOwnProperty("Lat")) {
      this.CoastsVertex = this.generateLineVertexSpecific(this.coastsData, [0.35, 0.35, 0.35, 1.0]);
    }
  }

  clearCoastsBuffers() {
    this.CoastsVertex = new LineVertex();
  }

  // ***********************************************************
  // Minor Islands
  // ***********************************************************
  private minorIslandsData : any;

  minorIslandsBuffers(minorIslands) {
    if (this._settings.minorIslands && minorIslands.Lat.length > 0) {
      this.minorIslandsData = minorIslands;
      this.processMinorIslands();
    }
  }

  public processMinorIslands() {
    if (this._settings.minorIslands && this.minorIslandsData.hasOwnProperty("Lat")) {
      this.MinorIslandsVertex = this.generateLineVertexSpecific(this.minorIslandsData, [0.35, 0.35, 0.35, 1.0]);
    }
  }

  clearMinorIslandsBuffers() {
    this.MinorIslandsVertex = new LineVertex();
  }

  // ***********************************************************
  // Lat Lon Lines related
  // ***********************************************************
  private latLonLinesData : any;

  public latLonLinesBuffers() {
    this.latLonLinesData = this.CreateLatLonGridLines(10, 10);
    this.processLatLon();
  }

  public processLatLon() {
    if (this.latLonLinesData.hasOwnProperty("Lat")) {
      this.LatLonVertex = this.generateLineVertexSpecific(this.latLonLinesData, [0.4, 0.4, 0.4, 1.0]);
    }
  }

  public clearLatLonLinesBuffers() {
    this.LatLonVertex = new LineVertex();
  }

  // ***********************************************************
  // Timezone related
  // ***********************************************************
  private timezoneData : any;

  public geoTimezoneBuffers(timezones) {
    this.timezoneData = timezones;
    this.processTimezone();
  }

  public processTimezone() {
    if (this._settings.timeZones && this.timezoneData.hasOwnProperty("Lat")) {
      this.TimeZonesVertex = this.generateLineVertexSpecific(this.timezoneData, [0.45, 0.45, 0.45, 1.0]);
    }
  }

  public clearTimezoneLinesBuffers() {
    this.TimeZonesVertex = new LineVertex();
  }

  // ***********************************************************
  // Geographical lines related
  // ***********************************************************
  private geoLinesData : any;

  public geoLinesBuffers(geoLines) {
    this.geoLinesData = geoLines;
    this.processGeolines()
  }

  public processGeolines() {
    if (this._settings.geoLines && this.geoLinesData.hasOwnProperty("Lat")) {
      this.GeoLinesVertex = this.generateLineVertexSpecific(this.geoLinesData, [0.45, 0.45, 0.45, 1.0]);
    }
  }

  public clearGeoLinesBuffers() {
    this.GeoLinesVertex = new LineVertex();
  }

}
