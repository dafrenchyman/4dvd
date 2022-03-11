import { WebGLBufferEnh } from "./WebGLBufferEnh";
/**
 * Created by dafre on 5/11/2017.
 */

import { ColorMap } from "./ColorMap";
import { GlMatrix } from "./GlMatrix";
import { Helpers } from "./helpers";
import { GlobeViewType, Settings } from "./settings";
import { WorldVertex } from "./worldVertex";

declare var jQuery: any;

export class World {
  WorldVertex: WorldVertex;

  GridBoxData: any[];
  SphereTriangles: any[];

  private _colorMap: ColorMap;
  private _settings: Settings;
  private _gl: WebGLRenderingContext;

  private rawData: any;

  public constructor(
    gl: WebGLRenderingContext,
    colorMap: ColorMap,
    settings: Settings
  ) {
    this._colorMap = colorMap;
    this._settings = settings;
    this._gl = gl;

    this.WorldVertex = new WorldVertex();
  }

  private submitDataForTriangles(triangleData) {
    let counter = 0;
    const worldVertexPositionBuffer = [];
    const worldVertexColorBuffer = [];
    const worldVertexIndexBuffer = [];
    const worldVertexNormalBuffer = [];
    const worldVertexTangentBuffer = [];
    const worldVertexBiTangentBuffer = [];
    const worldVertexTextureCoordBuffer = [];
    let worldVertexPositionData = [];
    let worldVertexColorData = [];
    let worldVertexNormalData = [];
    let worldVertexTangentData = [];
    let worldVertexBiTangentData = [];
    let worldIndexData = [];
    let worldVertexTextureCoordData = [];
    for (
      let triangleCounter = 0;
      triangleCounter < triangleData.length;
      triangleCounter++
    ) {
      const currTriangle = triangleData[triangleCounter];

      // Globe Position
      worldVertexPositionData.push(currTriangle[0].x);
      worldVertexPositionData.push(currTriangle[0].y);
      worldVertexPositionData.push(currTriangle[0].z);

      worldVertexPositionData.push(currTriangle[1].x);
      worldVertexPositionData.push(currTriangle[1].y);
      worldVertexPositionData.push(currTriangle[1].z);

      worldVertexPositionData.push(currTriangle[2].x);
      worldVertexPositionData.push(currTriangle[2].y);
      worldVertexPositionData.push(currTriangle[2].z);

      // Normals
      worldVertexNormalData.push(currTriangle[0].normal[0]);
      worldVertexNormalData.push(currTriangle[0].normal[1]);
      worldVertexNormalData.push(currTriangle[0].normal[2]);

      worldVertexNormalData.push(currTriangle[1].normal[0]);
      worldVertexNormalData.push(currTriangle[1].normal[1]);
      worldVertexNormalData.push(currTriangle[1].normal[2]);

      worldVertexNormalData.push(currTriangle[2].normal[0]);
      worldVertexNormalData.push(currTriangle[2].normal[1]);
      worldVertexNormalData.push(currTriangle[2].normal[2]);

      // Tangents
      worldVertexTangentData.push(currTriangle[0].tangent[0]);
      worldVertexTangentData.push(currTriangle[0].tangent[1]);
      worldVertexTangentData.push(currTriangle[0].tangent[2]);

      worldVertexTangentData.push(currTriangle[1].tangent[0]);
      worldVertexTangentData.push(currTriangle[1].tangent[1]);
      worldVertexTangentData.push(currTriangle[1].tangent[2]);

      worldVertexTangentData.push(currTriangle[2].tangent[0]);
      worldVertexTangentData.push(currTriangle[2].tangent[1]);
      worldVertexTangentData.push(currTriangle[2].tangent[2]);

      // BiTangents
      worldVertexBiTangentData.push(currTriangle[0].biTangent[0]);
      worldVertexBiTangentData.push(currTriangle[0].biTangent[1]);
      worldVertexBiTangentData.push(currTriangle[0].biTangent[2]);

      worldVertexBiTangentData.push(currTriangle[1].biTangent[0]);
      worldVertexBiTangentData.push(currTriangle[1].biTangent[1]);
      worldVertexBiTangentData.push(currTriangle[1].biTangent[2]);

      worldVertexBiTangentData.push(currTriangle[2].biTangent[0]);
      worldVertexBiTangentData.push(currTriangle[2].biTangent[1]);
      worldVertexBiTangentData.push(currTriangle[2].biTangent[2]);

      // Texture Coordinate
      worldVertexTextureCoordData.push(currTriangle[0].u);
      worldVertexTextureCoordData.push(currTriangle[0].v);

      worldVertexTextureCoordData.push(currTriangle[1].u);
      worldVertexTextureCoordData.push(currTriangle[1].v);

      worldVertexTextureCoordData.push(currTriangle[2].u);
      worldVertexTextureCoordData.push(currTriangle[2].v);

      // triangle Color
      worldVertexColorData.push(currTriangle[0].color[0]); // Red
      worldVertexColorData.push(currTriangle[0].color[1]); // Green
      worldVertexColorData.push(currTriangle[0].color[2]); // Blue
      worldVertexColorData.push(1.0); // Opac

      worldVertexColorData.push(currTriangle[1].color[0]);
      worldVertexColorData.push(currTriangle[1].color[1]);
      worldVertexColorData.push(currTriangle[1].color[2]);
      worldVertexColorData.push(1.0);

      worldVertexColorData.push(currTriangle[2].color[0]);
      worldVertexColorData.push(currTriangle[2].color[1]);
      worldVertexColorData.push(currTriangle[2].color[2]);
      worldVertexColorData.push(1.0);

      worldIndexData.push(counter++);
      worldIndexData.push(counter++);
      worldIndexData.push(counter++);

      if (
        (counter * 2) / (Math.pow(2, 16) - 1) > 1.0 ||
        triangleCounter === triangleData.length - 1
      ) {
        // Position
        const currWorldVertexPositionBuffer = new WebGLBufferEnh();
        currWorldVertexPositionBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexPositionBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexPositionData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexPositionBuffer.itemSize = 3;
        currWorldVertexPositionBuffer.numItems =
          worldVertexPositionData.length / 3;
        // worldVertexPositionBuffer.push(currWorldVertexPositionBuffer.buffer);
        worldVertexPositionBuffer.push(currWorldVertexPositionBuffer);

        // Texture Coordinate
        const currWorldVertexTextureCoordData = new WebGLBufferEnh();
        currWorldVertexTextureCoordData.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexTextureCoordData.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexTextureCoordData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexTextureCoordData.itemSize = 2;
        currWorldVertexTextureCoordData.numItems =
          worldVertexTextureCoordData.length / 2;
        // worldVertexTextureCoordBuffer.push(currWorldVertexTextureCoordData.buffer);
        worldVertexTextureCoordBuffer.push(currWorldVertexTextureCoordData);

        // Color
        const currWorldVertexColorBuffer = new WebGLBufferEnh();
        currWorldVertexColorBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexColorBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexColorData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexColorBuffer.itemSize = 4;
        currWorldVertexColorBuffer.numItems = worldVertexColorData.length / 4;
        // worldVertexColorBuffer.push(currWorldVertexColorBuffer.buffer);
        worldVertexColorBuffer.push(currWorldVertexColorBuffer);

        // Normal
        const currWorldVertexNormalBuffer = new WebGLBufferEnh();
        currWorldVertexNormalBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexNormalBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexNormalData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexNormalBuffer.itemSize = 3;
        currWorldVertexNormalBuffer.numItems = worldVertexNormalData.length / 3;
        // worldVertexNormalBuffer.push(currWorldVertexNormalBuffer.buffer);
        worldVertexNormalBuffer.push(currWorldVertexNormalBuffer);

        // Tangent
        const currWorldVertexTangentBuffer = new WebGLBufferEnh();
        currWorldVertexTangentBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexTangentBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexTangentData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexTangentBuffer.itemSize = 3;
        currWorldVertexTangentBuffer.numItems =
          worldVertexTangentData.length / 3;
        // worldVertexTangentBuffer.push(currWorldVertexTangentBuffer.buffer);
        worldVertexTangentBuffer.push(currWorldVertexTangentBuffer);

        // BiTangent
        const currWorldVertexBiTangentBuffer = new WebGLBufferEnh();
        currWorldVertexBiTangentBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ARRAY_BUFFER,
          currWorldVertexBiTangentBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          new Float32Array(worldVertexBiTangentData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexBiTangentBuffer.itemSize = 3;
        currWorldVertexBiTangentBuffer.numItems =
          worldVertexBiTangentData.length / 3;
        // worldVertexBiTangentBuffer.push(currWorldVertexBiTangentBuffer.buffer);
        worldVertexBiTangentBuffer.push(currWorldVertexBiTangentBuffer);

        // Index
        const currWorldVertexIndexBuffer = new WebGLBufferEnh();
        currWorldVertexIndexBuffer.buffer = this._gl.createBuffer();
        this._gl.bindBuffer(
          this._gl.ELEMENT_ARRAY_BUFFER,
          currWorldVertexIndexBuffer.buffer
        );
        this._gl.bufferData(
          this._gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(worldIndexData),
          this._gl.STATIC_DRAW
        );
        currWorldVertexIndexBuffer.itemSize = 1;
        currWorldVertexIndexBuffer.numItems = worldIndexData.length;
        // worldVertexIndexBuffer.push(currWorldVertexIndexBuffer.buffer);
        worldVertexIndexBuffer.push(currWorldVertexIndexBuffer);

        // Reset
        worldVertexPositionData = [];
        worldVertexColorData = [];
        worldIndexData = [];
        worldVertexTextureCoordData = [];
        worldVertexNormalData = [];
        worldVertexTangentData = [];
        worldVertexBiTangentData = [];
        counter = 0;
        // i++;
      }
    }
    return {
      position: worldVertexPositionBuffer,
      index: worldVertexIndexBuffer,
      color: worldVertexColorBuffer,
      textureCoord: worldVertexTextureCoordBuffer,
      normal: worldVertexNormalBuffer,
      tangent: worldVertexTangentBuffer,
      biTangent: worldVertexBiTangentBuffer
    };
  }

  private createSphereTriangles(bottomLeft, bottomRight, topLeft, topRight) {
    this.SphereTriangles.push(topLeft.point);
    this.SphereTriangles.push(bottomLeft.point);
    this.SphereTriangles.push(topRight.point);

    this.SphereTriangles.push(topRight.point);
    this.SphereTriangles.push(bottomLeft.point);
    this.SphereTriangles.push(bottomRight.point);
  }

  public GetRawData(): any {
    return this.rawData;
  }
  worldBuffers(rawData) {
    this.rawData = rawData;
    this.processBuffers();
  }

  processBuffers() {
    if (this._settings.newMin == null && this._settings.newMax == null) {
      // catch if newMin and newMax has not been updated yet
      this._settings.newMin = this._settings.minValue;
      this._settings.newMax = this._settings.maxValue;
    }

    // Reset the values because they may have already been set.
    this.WorldVertex.PositionBuffer = [];
    this.WorldVertex.ColorBuffer = [];
    this.WorldVertex.IndexBuffer = [];
    this.SphereTriangles = [];

    // Get the unique Lats, Lons
    if (this._settings.pacificCenter) {
      for (
        let lonCounter = 0;
        lonCounter < this.rawData.Lon.length;
        lonCounter++
      ) {
        if (this.rawData.Lon[lonCounter] < 0) {
          this.rawData.Lon[lonCounter] = this.rawData.Lon[lonCounter] + 360.0;
        }
      }
    } else {
      for (
        let lonCounter = 0;
        lonCounter < this.rawData.Lon.length;
        lonCounter++
      ) {
        if (this.rawData.Lon[lonCounter] > 180) {
          this.rawData.Lon[lonCounter] = this.rawData.Lon[lonCounter] - 360.0;
        }
      }
    }

    const lats = Helpers.ArrayUnique(this.rawData.Lat).sort((a, b) => a - b);
    const lons = Helpers.ArrayUnique(this.rawData.Lon).sort((a, b) => a - b);

    const maxLon = Helpers.ArrayMax(this.rawData.Lon);
    const minLon = Helpers.ArrayMin(this.rawData.Lon);

    // .replace(/\s/g, "")
    /*switch (LayerSettings.DataUnits) {
     case 'Kelvins':
     case 'degK':
     switch (LayerSettings.TemperatureType) {
     case 'C':
     for (var i = 0; i < RawData.Value.length; i++) {
     RawData.ValueFinal.push(KelvinToCelsius(RawData.Value[i]));
     }
     break;
     default :
     RawData.ValueFinal = RawData.Value;
     }
     break;
     default :
     RawData.ValueFinal = RawData.Value;
     }*/

    if (this._settings.DataUnits === "" || this._settings.DataUnits === "") {
    }

    // Create a 2 dimensional "map" that stores all the values
    const fullData = {};

    this.GridBoxData = [];

    // Must initialze the sub-objects
    for (let i = 0; i < lats.length; i++) {
      fullData[i] = {};
    }

    // Loop through the data to create the "map"
    const colorMap = this._colorMap.GetColorMap(
      this._settings.currColormapName
    );

    for (let i = 0; i < this.rawData.Lat.length; i++) {
      const curLat = this.rawData.Lat[i];
      const curLon = this.rawData.Lon[i];
      const curValue = this.rawData.ValueFinal[i];
      // var curValue = this.rawData.Value[i];
      const gridBox = this.rawData.GridBox_ID[i];

      const latIndex = lats.indexOf(curLat);
      const lonIndex = lons.indexOf(curLon);
      let color;

      // Pick the color selected in the dropdown
      if (curValue == null || curValue === undefined) {
        color = [0.7, 0.7, 0.7, 0.0];
      } else {
        switch (this._settings.functionForColorMap) {
          case "customColorMapWithMidpoint":
            color = this._colorMap.customColorMapWithMidpoint(
              colorMap,
              this._settings.newMin,
              0.0,
              this._settings.newMax,
              curValue
            );
            break;
          case "customColorMap":
            color = this._colorMap.customColorMap(
              colorMap,
              this._settings.newMin,
              this._settings.newMax,
              curValue
            );
            break;
          default:
            color = this._colorMap.customColorMap(
              colorMap,
              this._settings.newMin,
              this._settings.newMax,
              curValue
            );
            break;
        }
      }

      let currCoordinates = {
        coordinates: {
          x: curLon,
          y: curLat,
          z: 0.0
        },
        normals: { x: 0, y: 0, z: 1 },
        tangents: { x: 1, y: 0, z: 0 },
        biTangents: { x: 0, y: 1, z: 0 }
      };

      if (
        this._settings.globeView === GlobeViewType.Ortho ||
        this._settings.globeView === GlobeViewType.ThreeDim
      ) {
        currCoordinates = Helpers.cartesianToSphere(
          curLon * (Math.PI / 180.0),
          curLat * (Math.PI / 180.0),
          this._settings.EarthRadius
        );
      } else {
        currCoordinates = {
          coordinates: {
            x: curLon,
            y: curLat,
            z: 0.0
          },
          normals: { x: 0, y: 0, z: 1 },
          tangents: { x: 1, y: 0, z: 0 },
          biTangents: { x: 0, y: 1, z: 0 }
        };
      }

      // Coordinates
      const coordinates = GlMatrix.vec3.create();
      coordinates[0] = currCoordinates.coordinates.x;
      coordinates[1] = currCoordinates.coordinates.y;
      coordinates[2] = currCoordinates.coordinates.z;

      // Normals
      const normal = GlMatrix.vec3.create();
      normal[0] = currCoordinates.normals.x;
      normal[1] = currCoordinates.normals.y;
      normal[2] = currCoordinates.normals.z;

      // Tangents
      const tangent = GlMatrix.vec3.create();
      tangent[0] = currCoordinates.tangents.x;
      tangent[1] = currCoordinates.tangents.y;
      tangent[2] = currCoordinates.tangents.z;

      // BiTangents
      const biTangent = GlMatrix.vec3.create();
      biTangent[0] = currCoordinates.biTangents.x;
      biTangent[1] = currCoordinates.biTangents.y;
      biTangent[2] = currCoordinates.biTangents.z;

      const curData = {
        gridBox,
        lat: curLat,
        lon: curLon,
        anomaly: curValue,
        color,
        index: null,
        x: currCoordinates.coordinates.x,
        y: currCoordinates.coordinates.y,
        z: currCoordinates.coordinates.z,
        u: (curLon + 180.0) / 360,
        v: (curLat + 90.0) / 180,
        point: coordinates,
        normal,
        tangent,
        biTangent
      };

      this.GridBoxData.push(curData);
      fullData[latIndex][lonIndex] = curData;
    }

    const triangleData = [];

    for (let lonCounter = 0; lonCounter < lons.length - 1; lonCounter++) {
      for (let latCounter = 0; latCounter < lats.length - 1; latCounter++) {
        const bottomLeft = jQuery.extend(
          true,
          {},
          fullData[latCounter][lonCounter]
        );
        const bottomRight = jQuery.extend(
          true,
          {},
          fullData[latCounter][lonCounter + 1]
        );
        const topLeft = jQuery.extend(
          true,
          {},
          fullData[latCounter + 1][lonCounter]
        );
        const topRight = jQuery.extend(
          true,
          {},
          fullData[latCounter + 1][lonCounter + 1]
        );

        if (!this._settings.smoothGridBoxValues) {
          bottomLeft.color[0] = topLeft.color[0];
          bottomLeft.color[1] = topLeft.color[1];
          bottomLeft.color[2] = topLeft.color[2];

          bottomRight.color[0] = topLeft.color[0];
          bottomRight.color[1] = topLeft.color[1];
          bottomRight.color[2] = topLeft.color[2];

          topRight.color[0] = topLeft.color[0];
          topRight.color[1] = topLeft.color[1];
          topRight.color[2] = topLeft.color[2];
        }

        const triangleLeft = [topLeft, bottomLeft, topRight];
        const triangleRight = [topRight, bottomLeft, bottomRight];

        triangleData.push(triangleLeft);
        triangleData.push(triangleRight);

        // Need to also build out the triangles as well:
        this.createSphereTriangles(bottomLeft, bottomRight, topLeft, topRight);
      }
    }

    // Add back in the first section, to complete going around the sphere
    {
      const lonCounter = lons.length - 1;
      if (this._settings.globeView === GlobeViewType.TwoDim) {
        for (let latCounter = 0; latCounter < lats.length - 1; latCounter++) {
          const bottomLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonCounter]
          );
          const bottomRight = jQuery.extend(true, {}, fullData[latCounter][0]);
          const topLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonCounter]
          );
          const topRight = jQuery.extend(true, {}, fullData[latCounter + 1][0]);

          if (!this._settings.smoothGridBoxValues) {
            bottomLeft.color[0] = topLeft.color[0];
            bottomLeft.color[1] = topLeft.color[1];
            bottomLeft.color[2] = topLeft.color[2];

            bottomRight.color[0] = topLeft.color[0];
            bottomRight.color[1] = topLeft.color[1];
            bottomRight.color[2] = topLeft.color[2];

            topRight.color[0] = topLeft.color[0];
            topRight.color[1] = topLeft.color[1];
            topRight.color[2] = topLeft.color[2];
          }

          // Force the textCoord to map correctly for the globe
          bottomRight.point[0] += 360;
          bottomRight.lon += 360;
          bottomRight.x += 360;
          bottomRight.u += 1.0;
          topRight.point[0] += 360;
          topRight.lon += 360;
          topRight.x += 360;
          topRight.u += 1.0;

          // Fix the left side
          const triangleLeft = [topLeft, bottomLeft, topRight];
          const triangleRight = [topRight, bottomLeft, bottomRight];

          triangleData.push(triangleLeft);
          triangleData.push(triangleRight);

          // Need to also build out the triangles as well:
          this.createSphereTriangles(
            bottomLeft,
            bottomRight,
            topLeft,
            topRight
          );
        }
      } else if (
        this._settings.globeView === GlobeViewType.Ortho ||
        this._settings.globeView === GlobeViewType.ThreeDim
      ) {
        for (let latCounter = 0; latCounter < lats.length - 1; latCounter++) {
          const bottomLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonCounter]
          );
          const bottomRight = jQuery.extend(true, {}, fullData[latCounter][0]);
          const topLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonCounter]
          );
          const topRight = jQuery.extend(true, {}, fullData[latCounter + 1][0]);

          if (!this._settings.smoothGridBoxValues) {
            bottomLeft.color[0] = topLeft.color[0];
            bottomLeft.color[1] = topLeft.color[1];
            bottomLeft.color[2] = topLeft.color[2];

            bottomRight.color[0] = topLeft.color[0];
            bottomRight.color[1] = topLeft.color[1];
            bottomRight.color[2] = topLeft.color[2];

            topRight.color[0] = topLeft.color[0];
            topRight.color[1] = topLeft.color[1];
            topRight.color[2] = topLeft.color[2];
          }

          // Force the textCoord to map correctly for the globe
          bottomRight.u += 1.0;
          topRight.u += 1.0;

          // Fix the left side
          const triangleLeft = [topLeft, bottomLeft, topRight];
          const triangleRight = [topRight, bottomLeft, bottomRight];

          triangleData.push(triangleLeft);
          triangleData.push(triangleRight);

          // Need to also build out the triangles as well:
          this.createSphereTriangles(
            bottomLeft,
            bottomRight,
            topLeft,
            topRight
          );
        }
      }
    }

    // fix the edges on the 2d plot
    const skip = true;
    if (this._settings.globeView === GlobeViewType.TwoDim) {
      const lonIndexMax = lons.indexOf(maxLon);
      const lonIndexMin = lons.indexOf(minLon);

      // first strip
      {
        for (let latCounter = 0; latCounter < lats.length - 1; latCounter++) {
          const bottomLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonIndexMax]
          );
          const bottomRight = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonIndexMin]
          );
          const topLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonIndexMax]
          );
          const topRight = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonIndexMin]
          );

          {
            bottomLeft.lon = bottomLeft.x = bottomLeft.point[0] = this._settings
              .pacificCenter
              ? 0.0
              : -180.0;
            topLeft.lon = topLeft.x = topLeft.point[0] = this._settings
              .pacificCenter
              ? 0.0
              : -180.0;

            // Force the textCoord to map correctly for the globe
            bottomLeft.u = this._settings.pacificCenter ? 0.5 : 0.0;
            topLeft.u = this._settings.pacificCenter ? 0.5 : 0.0;

            if (!this._settings.smoothGridBoxValues) {
              bottomLeft.color[0] = topLeft.color[0];
              bottomLeft.color[1] = topLeft.color[1];
              bottomLeft.color[2] = topLeft.color[2];

              bottomRight.color[0] = topLeft.color[0];
              bottomRight.color[1] = topLeft.color[1];
              bottomRight.color[2] = topLeft.color[2];

              topRight.color[0] = topLeft.color[0];
              topRight.color[1] = topLeft.color[1];
              topRight.color[2] = topLeft.color[2];
            }

            const triangleLeft = [topLeft, bottomLeft, topRight];
            const triangleRight = [topRight, bottomLeft, bottomRight];

            triangleData.push(triangleLeft);
            triangleData.push(triangleRight);

            // Need to also build out the triangles as well:
            this.createSphereTriangles(
              bottomLeft,
              bottomRight,
              topLeft,
              topRight
            );
          }
        }
      }

      // last strip
      {
        for (let latCounter = 0; latCounter < lats.length - 1; latCounter++) {
          const bottomLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonIndexMax]
          );
          const bottomRight = jQuery.extend(
            true,
            {},
            fullData[latCounter][lonIndexMin]
          );
          const topLeft = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonIndexMax]
          );
          const topRight = jQuery.extend(
            true,
            {},
            fullData[latCounter + 1][lonIndexMin]
          );

          {
            bottomRight.lon = bottomRight.x = bottomRight.point[0] = this
              ._settings.pacificCenter
              ? 360.0
              : 180.0;
            topRight.lon = topRight.x = topRight.point[0] = this._settings
              .pacificCenter
              ? 360.0
              : 180.0;

            if (!this._settings.smoothGridBoxValues) {
              bottomLeft.color[0] = topLeft.color[0];
              bottomLeft.color[1] = topLeft.color[1];
              bottomLeft.color[2] = topLeft.color[2];

              bottomRight.color[0] = topLeft.color[0];
              bottomRight.color[1] = topLeft.color[1];
              bottomRight.color[2] = topLeft.color[2];

              topRight.color[0] = topLeft.color[0];
              topRight.color[1] = topLeft.color[1];
              topRight.color[2] = topLeft.color[2];
            }

            // Force the textCoord to map correctly for the globe
            bottomRight.u = this._settings.pacificCenter ? 1.5 : 1.0;
            topRight.u = this._settings.pacificCenter ? 1.5 : 1.0;

            const triangleLeft = [topLeft, bottomLeft, topRight];
            const triangleRight = [topRight, bottomLeft, bottomRight];

            triangleData.push(triangleLeft);
            triangleData.push(triangleRight);

            // Need to also build out the triangles as well:
            this.createSphereTriangles(
              bottomLeft,
              bottomRight,
              topLeft,
              topRight
            );
          }
        }
      }
    }

    const worldData = this.submitDataForTriangles(triangleData);
    this.WorldVertex.PositionBuffer = worldData.position;
    this.WorldVertex.ColorBuffer = worldData.color;
    this.WorldVertex.IndexBuffer = worldData.index;
    this.WorldVertex.TextureCoordBuffer = worldData.textureCoord;
    this.WorldVertex.NormalBuffer = worldData.normal;
    this.WorldVertex.TangentBuffer = worldData.tangent;
    this.WorldVertex.BiTangentBuffer = worldData.biTangent;
  }
}
