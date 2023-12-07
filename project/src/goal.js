// Crie uma função que retorna o objeto do gol
function createGoal() {
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
        return goal
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
    });
}
// Chamada da função na main

