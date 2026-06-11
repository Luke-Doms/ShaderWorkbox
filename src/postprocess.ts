import * as THREE from "three";

import passVert from './shaders/passVert.glsl?raw';
import passthroughFrag from './shaders/passthrough.frag?raw';
import pixelationFrag from './shaders/pixelation.frag?raw';
import receiptFrag from './shaders/receipt.frag?raw';

export const SHADERS = {
    passthrough: passthroughFrag,
    pixelation: pixelationFrag,
    receipt: receiptFrag,
}

export function buildPostProcess(renderer) {
    //create render target
    const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    const uniforms = {
        tScene: { value: target.texture },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iTime: { value: 0 },
        iMouse: { value: new THREE.Vector2(0, 0)},
    };

    let quadGeo = new THREE.PlaneGeometry(2, 2);

    function makeMaterial(srcShader) {
        return new THREE.ShaderMaterial({
            vertexShader: passVert,
            fragmentShader: srcShader,
            uniforms,
            depthTest: false,
            depthWrite: false,
        })
    }

    let currentKey = 'passthrough';
    let quadMesh = new THREE.Mesh(quadGeo, makeMaterial(SHADERS[currentKey]));

    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadScene = new THREE.Scene();
    quadScene.add(quadMesh);

    function setShader(key) {
        if (!SHADERS[key] || key === currentKey) return;
        currentKey = key;
        quadMesh.material = makeMaterial(SHADERS[currentKey]);
    }

    function onResize() {
        target.setSize(window.innerWidth, window.innerHeight);
        uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    }

    function render(scene, camera, time) {
        uniforms.iTime.value = time;

        renderer.setRenderTarget(target);
        renderer.render(scene, camera);

        renderer.setRenderTarget(null);
        renderer.render(quadScene, quadCamera);
    }
    return { render, setShader, onResize, uniforms };
}