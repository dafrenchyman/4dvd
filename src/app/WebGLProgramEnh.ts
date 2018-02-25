/**
 * Created by dafre on 5/11/2017.
 */

export class WebGLProgramEnh {
  public program : WebGLProgram;
  public vertexPositionAttribute : number;
  public vertexNormalAttribute : number;
  public vertexTangentAttribute : number;
  public vertexBiTangentAttribute : number;
  public vertexColorAttribute : number;
  public textureCoordAttribute : number;

  public pMatrixUniform : WebGLUniformLocation;
  public mvMatrixUniform : WebGLUniformLocation;
  public samplerUniform : WebGLUniformLocation;
  public useLightingUniform : WebGLUniformLocation;

  public ambientColorUniform : WebGLUniformLocation;
  public lightDirectionUniform : WebGLUniformLocation;
  public directionalColorUniform : WebGLUniformLocation;

  public nMatrixUniform : WebGLUniformLocation;
  public vMatrixUniform : WebGLUniformLocation;
}
