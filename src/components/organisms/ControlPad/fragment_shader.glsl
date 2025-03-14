precision mediump float;

varying float v_color;
uniform float u_time;

vec3 hsb2rgb (in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.);
  rgb = rgb * rgb * (3. - 2. * rgb);
  return c.z * mix(vec3(1.), rgb, c.y);
}

void main() {
  gl_FragColor = vec4(
    hsb2rgb(vec3(v_color + u_time * 2., .9, 1.)),
    1.
  );
}
