import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
const grassTexture = new THREE.TextureLoader().load('../img/fundo-de-grama-verde-campo-de-futebol_41969-1803.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const netTexture = new THREE.TextureLoader().load('path/to/net_texture.png');
netTexture.wrapS = THREE.RepeatWrapping;
netTexture.wrapT = THREE.RepeatWrapping;


class InputController {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this.current = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0,
        };
        this.previous = null;
        this.keys = {};
        this.previousKeys = {};

        document.addEventListener(
            "mousedown",
            (e) => this._OnMouseDown(e),
            false
        );
        document.addEventListener("mouseup", (e) => this._OnMouseUp(e), false);
        document.addEventListener(
            "mousemove",
            (e) => this._OnMouseMove(e),
            false
        );
        document.addEventListener("keydown", (e) => this._OnKeyDown(e), false);
        document.addEventListener("keyup", (e) => this._OnKeyUp(e), false);
    }

    _OnMouseDown(e) {
        switch (e.button) {
            case 0: {
                this.current.leftButton = true;
                break;
            }
            case 1: {
                this.current.rightButton = true;
                break;
            }
        }
    }

    _OnMouseUp(e) {
        switch (e.button) {
            case 0: {
                this.current.leftButton = false;
                break;
            }
            case 1: {
                this.current.rightButton = false;
                break;
            }
        }
    }

    _OnMouseMove(e) {
        this.current.mouseX = e.pageX - window.innerWidth / 2;
        this.current.mouseY = e.pageY - window.innerHeight / 2;

        if (this.previous === null) {
            this.previous = { ...this.current };
        }

        this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
        this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
    }

    _OnKeyDown(e) {
        this.keys[e.keyCode] = true;
    }

    _OnKeyDown(e) {
        this.keys[e.keyCode] = false;
    }

    update() {
        if (this.previous !== null) {
            this.current.mouseXDelta =
                this.current.mouseX - this.previous.mouseX;
            this.current.mouseYDelta =
                this.current.mouseY - this.previous.mouseY;

            this.previous = { ...this.current };
            this.previousKeys = { ...this.keys };
        }
    }
}

class FirstPersonCamera {
    constructor(camera) {
        this._camera = camera;
        this._input = new InputController();
        this._rotation = new THREE.Quaternion();
        this._translation = new THREE.Vector3();
        this._phi = 0;
        this._theta = 0;
    }

    update(timeElapsedS) {
        this._input.update();
        this._UpdateRotation(timeElapsedS);
        this._UpdateCamera(timeElapsedS);
    }

    _UpdateCamera(_) {
        this._camera.quaternion.copy(this._rotation);
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    _UpdateRotation(_) {
        const xh = this._input.current.mouseXDelta / window.innerWidth;
        const yh = this._input.current.mouseYDelta / window.innerHeight;

        this._phi += -xh * 5;
        this._theta = this.clamp(
            this._theta + -yh * 5,
            -Math.PI / 3,
            Math.PI / 3
        );

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        this._rotation.copy(q);
    }
}

class World {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer();
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener(
            "resize",
            () => {
                this._OnWindowResize();
            },
            false
        );

        const fov = 60;
        const aspect = 1280 / 720;
        const near = 1.0;
        const far = 1000.0;

        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(0, 5, 0); // Posição central e elevada

        // Ajuste a rotação da câmera para olhar para o centro do campo
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight("#fff", 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x101010);
        this._scene.add(light);

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            "../assets/posx.jpg",
            "../assets/negx.jpg",
            "../assets/posy.jpg",
            "../assets/negy.jpg",
            "../assets/posz.jpg",
            "../assets/negz.jpg",
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                map: grassTexture,
            })
        );
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._CreateGoal(0, 0, -45); // Movendo 5 unidades para frente
        this._CreateGoal(0, 0, 45);  // Movendo 5 unidades para frente

        this._CreateMidfieldLine();
        this._CreateCenterCircle();


        this._scene.add(plane);

        this.controls = new FirstPersonCamera(this._camera);

        this._RAF();
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this._Step(t - this._previousRAF);
            this._threejs.render(this._scene, this._camera);
            this._previousRAF = t;
            this._RAF();
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;

        this.controls.update(timeElapsedS);
    }

    _CreateGoal(x, y, z) {
        const goalPostsMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const crossbarMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

        const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32), goalPostsMaterial);
        const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 32), goalPostsMaterial);
        const crossbar = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.8, 0.5), crossbarMaterial);

        post1.position.set(x - 8, y + 5.34, z);
        post2.position.set(x + 8, y + 5.34, z);
        crossbar.position.set(x, y + 10, z);

        this._scene.add(post1);
        this._scene.add(post2);
        this._scene.add(crossbar);
    }

    _CreateMidfieldLine() {
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
        const geometry = new THREE.PlaneGeometry(100, 0.5); // Comprimento 100, espessura 0.5
        const line = new THREE.Mesh(geometry, material);
        line.rotation.x = -Math.PI / 2;
        line.position.y = 0.1;
        this._scene.add(line);
    }


    _CreateCenterCircle() {
        const outerRadius = 9.15; // Raio externo do círculo
        const innerRadius = 8.95; // Raio interno do círculo, criando um anel
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(geometry, material);
        circle.rotation.x = -Math.PI / 2;
        circle.position.y = 0.1;
        this._scene.add(circle);
    }









}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
    _APP = new World();
});
