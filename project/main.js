// main.js
import * as THREE from 'three';
import * as Field from './field.js';

// Criação da cena, câmera e renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Cor do céu

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 70);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Adicionando o campo à cena
const texturePath = 'Penalty-Fever-CG/project/img/pngtree-aerial-aerial-view-of-football-field-picture-image_1683396.jpg'; 
const field = Field.createField(texturePath);
scene.add(field);

// Adicionando linhas ao campo
Field.addLine(scene, 0, 0, 90, 1); // Linha do meio
// Adicione mais linhas conforme necessário

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
