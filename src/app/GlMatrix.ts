/**
 * Created by dafre on 5/12/2017.
 */

import * as glMatrix from 'gl-matrix';

export class GlMatrix {

  public static vec3: {
    add(out: number[], a: number[], b: number[]) : number[],
    clone(a : number[]) : number[],
    create() : number[],
    cross(out: number[], a: number[], b: number[]) : number[],
    dist(a: number[], b : number[]),
    distance(a: number[], b: number[]),
    dot(a: number[], b: number[]) : number,
    mul(out: number[], a: number[], b: number[]) : number[],
    multiply(out: number[], a: number[], b: number[]) : number[],
    normalize(out: number[], a: number[]) : number[],
    sub(out: number[], a: number[], b: number[]): number[],
    subtract(out: number[], a: number[], b: number[]): number[]
  } = {
    add(out,a,b) {
      return glMatrix.vec3.add(out,a,b);
    },
    clone(a) {
      return glMatrix.vec3.clone(a);
    },
    create() {
      return glMatrix.vec3.create();
    },
    cross(out, a, b) {
      return glMatrix.vec3.cross(out, a, b);
    },
    dist(a, b) {
      return glMatrix.vec3.dist(a,b);
    },
    distance(a, b) {
      return glMatrix.vec3.distance(a,b);
    },
    dot(a, b) {
      return glMatrix.vec3.dot(a,b);
    },
    mul(out,a,b) {
      return glMatrix.vec3.mul(out,a,b);
    },
    multiply(out,a,b) {
      return glMatrix.vec3.multiply(out,a,b);
    },
    normalize(out,a) {
      return glMatrix.vec3.normalize(out,a);
    },
    sub(out, a, b) {
      return glMatrix.vec3.sub(out, a, b);
    },
    subtract(out,a, b) {
      return glMatrix.vec3.subtract(out, a, b);
    }
  };

  public static vec4: {
    create() : number[],
  } = {
    create() {
      return glMatrix.vec4.create();
    }
  };

  public static mat3: {
    create() : number[],
    invert(out : number[], a : number[]) : number[],
    transpose(out : number[], a : number[]) : number[]
  } = {
    create() {
      return glMatrix.mat3.create();
    },
    invert(out,a) {
      return glMatrix.mat3.invert(out,a);
    },
    transpose(out,a) {
      return glMatrix.mat3.transpose(out, a);
    }
  };

  public static mat4: {
    copy(out : number[], a : number[]) : number[],
    create() : number[],
    identity(out : number[]) : number[],
    invert(out : number[], a : number[]) : number[],
    multiply(out : number[], a : number[], b : number[]) : number[],
    multiplyVec3(out : number[], mat_in : number[], vec_in : number[]) : number[],
    ortho(out : number[], left : number, right : number, bottom : number, top : number, near : number, far : number) : number[],
    perspective(out : number[], fovy : number, aspect : number, near : number, far : number) : number[],
    rotate(out : number[], a : number[], rad : number, axis :number[]) : number[],
    translate(out : number[],a : number[], v: number[] ) : number[],
    toMat3(out: number[], a : number[]) : number[]
  } = {
    copy(out, a) {
      return glMatrix.mat4.copy(out, a);
    },
    create() {
      return glMatrix.mat4.create();
    },
    identity(out) {
      return glMatrix.mat4.identity(out);
    },
    invert(out, a) {
      return glMatrix.mat4.invert(out, a);
    },
    multiply(out, a, b) {
      return glMatrix.mat4.multiply(out, a, b);
    },
    multiplyVec3(out, mat_in, vec_in) {
      //var out = vec3.create() || (out = vec_in);
      var d = vec_in[0], e = vec_in[1], f = vec_in[2];
      out[0] = mat_in[0] * d + mat_in[4] * e + mat_in[8] * f + mat_in[12];
      out[1] = mat_in[1] * d + mat_in[5] * e + mat_in[9] * f + mat_in[13];
      out[2] = mat_in[2] * d + mat_in[6] * e + mat_in[10] * f + mat_in[14];
      return out;
    },
    ortho(out, left, right, bottom, top, near, far){
      return glMatrix.mat4.ortho(out, left, right, bottom, top, near, far);
    },
    perspective(out, fovy, aspect, near, far) {
        return glMatrix.mat4.perspective(out, fovy, aspect, near, far);
    },
    rotate(out, a, rad, axis){
      return glMatrix.mat4.rotate(out, a, rad, axis);
    },
    translate(out, a, v) {
      return glMatrix.mat4.translate(out, a, v);
    },
    toMat3(out : number[], a : number[]) {
      //var out = new glMatrix.ARRAY_TYPE(9);
      var out : number[];
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[4];
      out[4] = a[5];
      out[5] = a[6];
      out[6] = a[8];
      out[7] = a[9];
      out[8] = a[10];
      return out;
    }
  };
};
