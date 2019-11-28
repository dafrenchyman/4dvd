import { WebGLProgramEnh } from "./WebGLProgramEnh";

export class Shaders {
  public lineShader: WebGLProgramEnh;
  public worldShader: WebGLProgramEnh;

  public constructor() {
    this.lineShader = new WebGLProgramEnh();
    this.worldShader = new WebGLProgramEnh();
  }
}
