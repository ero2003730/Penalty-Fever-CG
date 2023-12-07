// field.js
import * as THREE from 'three';

export function createField(texturePath) {
  // Carrega a textura
  const loader = new THREE.TextureLoader();
  const texture = loader.load(texturePath);

  // Criação do campo de futebol com a textura
  const fieldGeometry = new THREE.PlaneGeometry(100, 50); // Dimensões do campo
  const fieldMaterial = new THREE.MeshLambertMaterial({ map: texture }); // Uso da textura
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.rotation.x = -Math.PI / 2; // Rotacionar para ficar horizontal

  return field;
}

export function addLine(scene, x, y, width, height, color = 0xffffff) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const line = new THREE.Mesh(geometry, material);
  line.position.set(x, y, 0.1); // Posiciona ligeiramente acima do campo
  line.rotation.x = -Math.PI / 2;
  scene.add(line);
}
