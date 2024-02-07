import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Universe } from './services/universe.service';

const FOV = 40;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    // Start
    cameraPos: number[] = [0, 1000, 0];

    // Three 
    scene: any;
    camera: any;
    renderer: any;
    controls: any;

    // Sim
    universe: Universe;

    constructor() {
        this.setup()

        this.universe = new Universe(this.scene)
    }

    private setup(): void {
        this.initThree()
    }

    update() {
        this.onWindowResize();
        this.renderer.render(this.scene, this.camera);
    }

    initThree(): void {
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 500000000000000000);
        this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });

        // Add grid
        const gridSize = 100
        const gridHelper = new THREE.GridHelper(gridSize * 20, 50);
        this.scene.add(gridHelper);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        let app = this
        var animate = function () {
            requestAnimationFrame(animate);
            app.update();
            app.controls.update();
            if (app.universe) app.universe.update()
        };

        animate();
    }

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
