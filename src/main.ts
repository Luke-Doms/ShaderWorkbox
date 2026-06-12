import './style.css';
import { Timer } from 'three';
import * as THREE from 'three';
import { buildScene } from './scene.ts';
import { SHADERS, ASSETS, buildPostProcess } from './postProcess.ts';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const { scene, camera, update: sceneUpdate, onResize: resizeScene} = buildScene();
const { render: postRender, setShader, onResize: resizePost, uniforms } = buildPostProcess(renderer);

const shaderSelect = document.getElementById('shader-select') as HTMLSelectElement;
const assetSelect = document.getElementById("asset-select") as HTMLSelectElement;

Object.keys(SHADERS).forEach((key) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = key;
  shaderSelect.appendChild(option);
});

const assetGroups = new Map<string, HTMLOptGroupElement>();
Object.entries(ASSETS).forEach(([key, asset]: [string, typeof ASSETS[string]]) => {
  if (!assetGroups.has(asset.type)) {
    const group = document.createElement('optgroup');
    group.label = asset.type.charAt(0).toUpperCase() + asset.type.slice(1) + 's';
    assetGroups.set(asset.type, group);
    assetSelect.appendChild(group);
  }
  const option = document.createElement('option');
  option.value = key;
  option.textContent = asset.name;
  assetGroups.get(asset.type)!.appendChild(option);
});

shaderSelect.addEventListener("change", () => setShader(shaderSelect.value, assetSelect.value));
assetSelect.addEventListener("change", () => setShader(shaderSelect.value, assetSelect.value));

window.addEventListener('mousemove', e => {
  uniforms.iMouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight
  );
});

// Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeScene();
  resizePost();
});

const timer = new Timer();
function loop() {
  requestAnimationFrame(loop);
  timer.update();
  const t = timer.getElapsed();
  sceneUpdate(t);
  postRender(scene, camera, t);
}
loop();