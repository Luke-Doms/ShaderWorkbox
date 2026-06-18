uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

void main() {
  float mask = step(0.0, vUv.x) * step(vUv.x, 1.0) * step(0.0, vUv.y) * step(vUv.y, 1.0);
  gl_FragColor = vec4(texture2D(tScene, clamp(vUv, 0.0, 1.0)).rgb * mask, 1.0);
}