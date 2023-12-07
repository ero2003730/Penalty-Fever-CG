// goal.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function loadGoal(scene, modelPath) {
    // Crie um carregador para o modelo GLTF
    const loader = new GLTFLoader();

    // Carregar o modelo e adicioná-lo à cena
    loader.load(modelPath, (gltf) => {
        const goal = gltf.scene;

        // Ajusta a posição do gol
        goal.position.x = -915; // Move o gol para trás

        // Ajusta a escala do modelo se necessário
        goal.scale.set(0.5, 1, 1.1);

        // Adiciona o gol à cena
        scene.add(goal);
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
    });
}

export { loadGoal };
