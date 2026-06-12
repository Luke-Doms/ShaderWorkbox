import * as THREE from "three";

import passVert from './shaders/passVert.glsl?raw';
import passthroughFrag from './shaders/passthrough.frag?raw';
import pixelationFrag from './shaders/pixelation.frag?raw';
import receiptFrag from './shaders/receipt.frag?raw';
import circularFrag from './shaders/circular.frag?raw';

import catsInterest from './assets/CatsInterest.jpeg';
import klimtDeath from './assets/KlimtDeath.jpeg';
import langNibelungen from './assets/LangNibelungen.jpeg';

export const SHADERS: Record<string, string> = {
    passthrough: passthroughFrag,
    pixelation: pixelationFrag,
    receipt: receiptFrag,
    circular: circularFrag,
};

export const ASSETS: Record<string, { type: 'scene' | 'texture', src: string | null, name: string }> = {
    basicScene:     { type: 'scene',   src: null,           name: 'Basic Scene' },
    catsInterest:   { type: 'texture', src: catsInterest,   name: 'Cats Interest' },
    klimtDeath:     { type: 'texture', src: klimtDeath,     name: 'Death' },
    langNibelungen: { type: 'texture', src: langNibelungen, name: 'Nibelungen' },
};

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

    const textureLoader = new THREE.TextureLoader();
    const loadedTextures = new Map<string, THREE.Texture>();
    function getTexture(src: string): THREE.Texture {
        if (!loadedTextures.has(src)) loadedTextures.set(src, textureLoader.load(src));
        return loadedTextures.get(src)!;
    }

    let quadGeo = new THREE.PlaneGeometry(2, 2);

    function makeMaterial(srcShader: string) {
        return new THREE.ShaderMaterial({
            vertexShader: passVert,
            fragmentShader: srcShader,
            uniforms,
            depthTest: false,
            depthWrite: false,
        })
    }

    let useSceneRender = true;
    let currentKey = 'passthrough';
    let quadMesh = new THREE.Mesh(quadGeo, makeMaterial(SHADERS[currentKey]));

    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadScene = new THREE.Scene();
    quadScene.add(quadMesh);

    function setShader(shaderKey: string, assetKey: string) {
        const shader = SHADERS[shaderKey];
        const asset = ASSETS[assetKey];
        if (!shader || !asset) return;
        if (asset.type === 'scene') {
            uniforms.tScene.value = target.texture;
            useSceneRender = true;
        } else {
            uniforms.tScene.value = getTexture(asset.src as string);
            useSceneRender = false;
        }
        quadMesh.material = makeMaterial(shader);
    }

    function onResize() {
        target.setSize(window.innerWidth, window.innerHeight);
        uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    }

    function render(scene, camera, time) {
        uniforms.iTime.value = time;

        if (useSceneRender) {
            renderer.setRenderTarget(target);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
        }

        renderer.render(quadScene, quadCamera);
    }
    return { render, setShader, onResize, uniforms };
}