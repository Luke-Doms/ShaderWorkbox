import * as THREE from 'three';

export function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 4);
  camera.lookAt(0, 0, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  // Cube
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4488ff, roughness: 0.4, metalness: 0.2 })
  );
  cube.position.set(-0.8, 1, 0);
  scene.add(cube);

  // Sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff6644, roughness: 0.3, metalness: 0.5 })
  );
  sphere.position.set(0.8, 1, 0.5);
  scene.add(sphere);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function update(t: number) {
    cube.rotation.y = t * 0.5;
    cube.rotation.x = t * 0.3;
    sphere.position.y = 1 + Math.sin(t * 1.2) * 0.2;
  }

  return { scene, camera, update, onResize };
}