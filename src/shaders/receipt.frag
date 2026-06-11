uniform sampler2D tScene;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

float pixelSize = 8.0;

void main() {
    vec2 normalizedPixelSize = vec2(pixelSize/iResolution[0], pixelSize/iResolution[1]);
    float rowIndex = floor(vUv.x / normalizedPixelSize.x);
    vec2 uvPixel = normalizedPixelSize * (floor(vUv/normalizedPixelSize));

    vec4 color = texture2D(tScene, uvPixel);

    float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    vec2 cellUV = fract(vUv / normalizedPixelSize);
    float lineWidth = 0.0;

    if (luma > 0.0) {
    lineWidth = 1.0;
    }

    if (luma > 0.3) {
    lineWidth = 0.7;
    }

    if (luma > 0.5) {
    lineWidth = 0.5;
    }

    if (luma > 0.7) {
    lineWidth = 0.3;
    }

    if (luma > 0.9) {
    lineWidth = 0.1;
    }

    if (luma > 0.99) {
    lineWidth = 0.0;
    }

    float yStart = 0.05;
    float yEnd = 0.95;

    if (cellUV.y > yStart && cellUV.y < yEnd && cellUV.x > 0.0 && cellUV.x < lineWidth) {
        color = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        color = vec4(0.70,0.74,0.73, 1.0);
    }
    
    gl_FragColor = color;
}