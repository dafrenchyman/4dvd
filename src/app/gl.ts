/**
 * Created by dafre on 5/11/2017.
 */

import { ElementRef } from "@angular/core";
import { ColorMap } from "./ColorMap";
import { GlMatrix } from "./GlMatrix";
import { Helpers } from "./helpers";
import { Lines } from "./lines";
import { GlobeViewType, Settings } from "./settings";
import { WebGLProgramEnh } from "./WebGLProgramEnh";
import { WebGLTextureEnh } from "./WebGLTextureEnh";
import { World } from "./world";
/*import {Observable} from "rxjs/Observable";*/

export class Gl {
  public constructor(canvas: ElementRef, width: number, height: number) {
    // this._world = new World(this.GL, this._colorMap, this._settings);
    // this._lines = new Lines(this.GL, this._settings, this._colorMap);
    // this.initBuffers(null);
  }
}
