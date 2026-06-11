uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tScene, vUv);
}