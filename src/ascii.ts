import * as THREE from 'three';
const fontFamily = "mono";

export function getASCIITexture(): THREE.Texture {
    const asciiChars = "./ノハメラマ木";
    const charSize = 16;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = charSize * asciiChars.length;
    canvas.height = charSize;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = `${charSize}px ${fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    asciiChars.split('').forEach((char, i) => {
        ctx.fillText(char, (i + 0.5) * charSize, charSize/2);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return texture;
}