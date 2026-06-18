uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

float pixelSize = 8.0;

void main() {
    vec2 normalizedPixelSize = vec2(pixelSize/iResolution[0], pixelSize/iResolution[1]);
    float rowIndex = floor(vUv.x / normalizedPixelSize.x);
    vec2 uvPixel = normalizedPixelSize * floor(vUv / normalizedPixelSize);
    vec3 color = texture2D(tScene, uvPixel).rgb;

    float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    
    vec2 cellUV = fract(vUv / normalizedPixelSize);

    float radius = luma > 0.5 ? 0.3 : luma > 0.001 ? 0.12 : 0.075;
    vec2 circleCenter = luma > 0.5 ? vec2(0.5, 0.5) : vec2(0.25, 0.25);

    float distanceFromCenter = distance(cellUV, circleCenter);

    float circleMask = smoothstep(radius, radius - 0.05, distanceFromCenter);
    color.rgb = vec3(circleMask, circleMask, circleMask) * max(luma, 0.05); 

    float mask = step(0.0, vUv.x) * step(vUv.x, 1.0) * step(0.0, vUv.y) * step(vUv.y, 1.0);
    gl_FragColor = vec4(color.rgb * mask, 1.0);
}