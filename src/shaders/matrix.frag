uniform sampler2D tScene;
uniform sampler2D tAscii;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

varying vec2 vUv;

float pixelSize = 16.0;
float charCount = 8.0;

void main() {
    vec2 normalizedPixelSize = vec2(pixelSize/iResolution[0], pixelSize/iResolution[1]);
    float rowIndex = floor(vUv.x / normalizedPixelSize.x);
    vec2 uvPixel = normalizedPixelSize * (floor(vUv/normalizedPixelSize));

    vec4 color = texture2D(tScene, uvPixel);

    float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    vec2 cellUV = fract(vUv / normalizedPixelSize);
    float lineWidth = 0.0;

    float charIndex = clamp(
        floor(luma * (charCount - 1.0)), 
        0.0, 
        charCount - 1.0
    );

    vec2 asciiUV = vec2(
        (charIndex + cellUV.x) / charCount,
        cellUV.y
    );

    float character = texture2D(tAscii, asciiUV).r;
    vec3 backgroundColor = color.rgb;
    //gl_FragColor = texture2D(tAscii, asciiUV);
    float mask = step(0.0, vUv.x) * step(vUv.x, 1.0) * step(0.0, vUv.y) * step(vUv.y, 1.0);
    gl_FragColor = vec4((character * vec3(1.0) * (luma + 0.01) + backgroundColor) * mask, 1.0);
}