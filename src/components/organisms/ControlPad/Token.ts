import {
  compileShader,
  Matrix16,
  mult,
  rotateX,
  rotateY,
  rotateZ,
  translate,
} from "../../../utils/webGl";
import fragmentShader from "./fragment_shader.glsl?raw";
import vertexShader from "./vertex_shader.glsl?raw";

export type RatiosAndCoords = {
  x: number;
  xRatio: number;
  y: number;
  yRatio: number;
};

const rotationBaseAmount = 0.01;
const rotationVelocityComponent = 1.2;
const fallAwayVelocity = 32;
const zMin = -8096;
const zMax = -360;
const returnVelocity = 512;
const maxDepth = 3;

const vertices = new Float32Array([
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  -0.5, 0.5, -0.5, -0.5,

  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
  0.5, 0.5, 0.5, 0.5,

  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5,

  0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
  -0.5, 0.5, 0.5, 0.5,

  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, -0.5,

  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5,
  0.5, 0.5, -0.5, 0.5, -0.5,
]);

const colors = new Uint8Array([
  255, 70, 50, 255, 70, 50, 255, 70, 50, 255, 70, 50, 255, 70, 50, 255, 70, 50,
  90, 70, 255, 90, 70, 255, 90, 70, 255, 90, 70, 255, 90, 70, 255, 90, 70, 255,
]);

const makePerspective = (
  fov: number,
  aspect: number,
  near: number,
  far: number,
): Matrix16 => {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  const rangeInv = 1.0 / (near - far);

  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (near + far) * rangeInv,
    -1,
    0,
    0,
    near * far * rangeInv * 2,
    0,
  ];
};

const ratioToMod = (ratio: number) =>
  ratio < 0.5 ? -Math.pow(ratio - 0.5, 2) : Math.pow(ratio - 0.5, 2);

const modToRotationInc = (mod: number) =>
  rotationBaseAmount + rotationVelocityComponent * mod;

export default class {
  active: boolean;
  gl: WebGLRenderingContext;
  ratiosAndCoords: RatiosAndCoords;
  rotations: { x: number; y: number; z: number };
  sideLength: number;
  z: number;
  constructor({
    gl,
    sideLength,
  }: {
    gl: WebGLRenderingContext;
    sideLength: number;
  }) {
    const program = gl.createProgram();

    this.active = false;
    this.gl = gl;
    this.ratiosAndCoords = { x: 0, xRatio: 0, y: 0, yRatio: 0 };
    this.rotations = { x: 0, y: 0, z: 0 };
    this.sideLength = sideLength;
    this.z = zMin;

    gl.attachShader(program, compileShader(gl, vertexShader, gl.VERTEX_SHADER));
    gl.attachShader(
      program,
      compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER),
    );

    gl.linkProgram(program);
    gl.useProgram(program);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const uTimeLocation = gl.getUniformLocation(program, "u_time");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 1, gl.UNSIGNED_BYTE, true, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const render = () => {
      requestAnimationFrame(render);
      const { x, xRatio, y, yRatio } = this.ratiosAndCoords;
      const xMod = ratioToMod(xRatio);
      const yMod = ratioToMod(yRatio);

      if (this.active) {
        if (this.z < zMax) {
          if (this.z > zMax - returnVelocity) this.z = zMax;
          else this.z += returnVelocity;
        }
      } else if (this.z > zMin - maxDepth) this.z -= fallAwayVelocity;

      const rotationMatrix = mult(
        rotateY((this.rotations.y += modToRotationInc(yMod))),
        mult(
          rotateX((this.rotations.x += modToRotationInc(xMod))),
          rotateZ((this.rotations.z += modToRotationInc(xMod * yMod))),
        ),
      );

      const translationMatrix = translate(
        x - this.sideLength / 2,
        this.sideLength / 2 - y,
        this.z,
      );
      const projectionMatrix = makePerspective(
        Math.PI * 0.0005 * this.sideLength,
        1,
        1,
        2048,
      );

      const matrix = mult(
        mult(rotationMatrix, translationMatrix),
        projectionMatrix,
      );

      // TODO this will overflow
      gl.uniform1f(uTimeLocation, performance.now() / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    };

    requestAnimationFrame(render);
  }

  handleInput(ratiosAndCoords: RatiosAndCoords) {
    this.ratiosAndCoords = ratiosAndCoords;
    this.active = true;
  }

  handleInputEnd() {
    this.active = false;
  }

  handleResize(sideLength: number) {
    this.sideLength = sideLength;
    this.gl.viewport(0, 0, sideLength, sideLength);
  }
}
