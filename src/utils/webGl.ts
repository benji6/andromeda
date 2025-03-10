export const compileShader = (
  gl: WebGLRenderingContext,
  src: string,
  shaderType: GLenum,
): WebGLShader => {
  const shader = gl.createShader(shaderType);
  if (shader === null) throw Error("Failed to create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
};

export type Matrix16 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const mult = (a: Matrix16, b: Matrix16): Matrix16 => [
  a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
  a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
  a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
  a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
  a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
  a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
  a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
  a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
  a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
  a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
  a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
  a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
  a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
  a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
  a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
  a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
];

export const rotateX = (a: number): Matrix16 => {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};

export const rotateY = (a: number): Matrix16 => {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};

export const rotateZ = (a: number): Matrix16 => {
  const c = Math.cos(a);
  const s = Math.sin(a);

  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const translate = (x: number, y: number, z: number): Matrix16 => [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  x,
  y,
  z,
  1,
];
