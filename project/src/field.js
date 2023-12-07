// field.js
import * as THREE from 'three';

export function createField(texturePath) {
  // Carrega a textura
  const loader = new THREE.TextureLoader();
  const texture = loader.load(texturePath);

  // Criação do campo de futebol com a textura
  const fieldGeometry = new THREE.PlaneGeometry(2500, 4000); // Dimensões do campo
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

export function createWalls(scene) {
  const wallHeight = 50000; // Altura das paredes
  const wallThickness = 50; // Espessura das paredes
  const fieldWidth = 2500; // Largura do campo
  const fieldLength = 4000; // Comprimento do campo

  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xD3D3D3 }); // Cor cinza claro para as paredes

  // Paredes do comprimento
  const lengthWallGeometry = new THREE.BoxGeometry(fieldWidth + wallThickness * 2, wallHeight, wallThickness);
  const leftWall = new THREE.Mesh(lengthWallGeometry, wallMaterial);
  leftWall.position.set(0, wallHeight / 2, -fieldLength / 2 - wallThickness / 2);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(lengthWallGeometry, wallMaterial);
  rightWall.position.set(0, wallHeight / 2, fieldLength / 2 + wallThickness / 2);
  scene.add(rightWall);

  // Paredes da largura
  const widthWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, fieldLength + wallThickness * 2);
  const backWall = new THREE.Mesh(widthWallGeometry, wallMaterial);
  backWall.position.set(-fieldWidth / 2 - wallThickness / 2, wallHeight / 2, 0);
  scene.add(backWall);

 
}