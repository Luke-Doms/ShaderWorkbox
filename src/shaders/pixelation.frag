uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

float pixelSize = 8.0;

void main() {
    vec2 normalizedPixelSize = vec2(pixelSize/iResolution[0], pixelSize/iResolution[1]);
    vec2 uvPixel = normalizedPixelSize * (floor(vUv/normalizedPixelSize));
    gl_FragColor = texture2D(tScene, uvPixel);
}