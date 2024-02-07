import { Component } from '@angular/core';
import * as THREE from 'three';

const FOV = 40;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    // Start
    cameraPos: number[] = [0, 0, 1000];

    // Three 
    scene: any;
    camera: any;
    renderer: any;
    controls: any;

    constructor() {
        this.setup()
    }

    private setup(): void {
        this.initThree()
        this.initScene()
    }

    initThree(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 500000000000000000);
        this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        let app = this
        var animate = function () {
            requestAnimationFrame(animate);
            app.onWindowResize();
            app.renderer.render(app.scene, app.camera);
        };

        animate();
    }

    initScene(): void {
        let geometry = new THREE.BoxGeometry(200, 200, 200);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
