uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

float pixelSize = 8.0;

void main() {
    float mask = step(0.0, vUv.x) * step(vUv.x, 1.0) * step(0.0, vUv.y) * step(vUv.y, 1.0);
    vec2 normalizedPixelSize = vec2(pixelSize/iResolution[0], pixelSize/iResolution[1]);
    vec2 uvPixel = normalizedPixelSize * (floor(vUv/normalizedPixelSize));
    gl_FragColor = vec4(texture2D(tScene, clamp(uvPixel, 0.0, 1.0)).rgb * mask, 1.0);
}