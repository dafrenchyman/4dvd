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
