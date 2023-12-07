// main.js
import * as THREE from 'three';
import * as Field from './field.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Crie um carregador para o modelo GLTF
const loader = new GLTFLoader();

// Caminho para o seu arquivo GLTF
const modelPath = '/models/soccer_goal/scene.gltf';

// Carregar o modelo e adicioná-lo à cena
loader.load(modelPath, (gltf) => {
  const goal = gltf.scene;

  // Ajusta a posição do gol
  goal.position.x = -915; // Move o gol 100 unidades para trás

  // Ajusta a escala do modelo se necessário
  goal.scale.set(0.5, 1, 1.1);

  // Adiciona o gol à cena
  scene.add(goal);
}, undefined, (error) => {
  console.error('An error happened while loading the model:', error);
});



// Criação da cena, câmera e renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Cor do céu

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(100, 1000, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Adicionando o campo à cena
const texturePath = '/img/quadra.jpeg';
const field = Field.createField(texturePath);
scene.add(field);

// Adicionando linhas ao campo
//Field.addLine(scene, 0, 0, 90, 1); // Linha do meio
// Adicione mais linhas conforme necessário

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Ativa o amortecimento (inércia)
controls.dampingFactor = 0.25; // Fator de amortecimento
controls.maxPolarAngle = Math.PI / 2; // Limita o ângulo para que a câmera não vá abaixo do plano


animate();
