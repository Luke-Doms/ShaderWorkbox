uniform vec2 iResolution;
uniform vec2 tResolution;

varying vec2 vUv;

void main() {
    float screenAspect = iResolution.x / iResolution.y;
    float imageAspect  = tResolution.x  / tResolution.y;

    vec2 uvScale;
    if (screenAspect > imageAspect) {
        uvScale = vec2(screenAspect / imageAspect, 1.0);
    } else {
        uvScale = vec2(1.0, imageAspect / screenAspect);
    }

    vUv = (uv - 0.5) * uvScale + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}