import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Função que retorna o objeto da bola

function createBall() {
    // Crie um carregador para o modelo GLTF
    const loader = new GLTFLoader();

    // Caminho para o seu arquivo GLTF
    const modelPath = '/models/soccer_ball/scene.gltf';

    // Carregar o modelo e adicioná-lo à cena
    loader.load(modelPath, (gltf) => {
        const ball = gltf.scene;

        // Ajusta a posição da bola
        ball.position.x = 0; // Move a bola 100 unidades para trás

        // Ajusta a escala do modelo se necessário
        ball.scale.set(0.5, 1, 1.1);

        // Adiciona a bola à cena
        return ball
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
    });
}
