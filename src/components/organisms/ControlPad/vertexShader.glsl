attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * (a_position * vec4(32.0, 32.0, 32.0, 1.0));
  v_color = a_color;
}
