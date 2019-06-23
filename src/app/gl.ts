/**
 * Created by dafre on 5/11/2017.
 */

import {WebGLProgramEnh} from './WebGLProgramEnh';
import {WebGLTextureEnh} from './WebGLTextureEnh';
import {ElementRef} from '@angular/core';
import {Helpers} from './helpers';
import {GlMatrix} from 'app/GlMatrix';
import {GlobeViewType, Settings} from './settings';
import {ColorMap} from './ColorMap';
import {World} from './world';
import {Lines} from './lines';
import {Observable} from 'rxjs/Observable';

export class Shaders {
  public lineShader: WebGLProgramEnh;
  public worldShader: WebGLProgramEnh;

  public constructor() {
    this.lineShader = new WebGLProgramEnh();
    this.worldShader = new WebGLProgramEnh();
  }
}

export class GlBuffer {
  public buffer: WebGLBuffer;
  public itemSize: number;
  public numItems: number;
  public constructor(gl: WebGLRenderingContext) {
    this.buffer = gl.createBuffer();
    this.itemSize = 0;
    this.numItems = 0;
  }
}

export class Gl {



  public constructor(canvas: ElementRef, width: number, height: number) {



    // this._world = new World(this.GL, this._colorMap, this._settings);
    // this._lines = new Lines(this.GL, this._settings, this._colorMap);

    // this.initBuffers(null);

  }



}
