attribute vec4 a_position;
attribute float a_color;

uniform mat4 u_matrix;

varying float v_color;

mat4 zToW = mat4(
  1., 0., 0., 0.,
  0., 1., 0., 0.,
  0., 0., 1., 0.75,
  0., 0., 0., 1.
);

void main() {
  gl_Position = (zToW * u_matrix) * (a_position * vec4(32.0, 32.0, 32.0, 1.0));
  v_color = a_color;
}
