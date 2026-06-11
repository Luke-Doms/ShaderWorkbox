import './style.css';
import { Timer } from 'three';
import * as THREE from 'three';
import { buildScene } from './scene.ts';
import { SHADERS, buildPostProcess } from './postProcess.ts';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const { scene, camera, update: sceneUpdate, onResize: resizeScene} = buildScene();
const { render: postRender, setShader, onResize: resizePost, uniforms } = buildPostProcess(renderer);

const select = document.getElementById('shader-select');
Object.keys(SHADERS).forEach((key) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = key;
  select.appendChild(option);
})
select.addEventListener("change", () => setShader(select.value));

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