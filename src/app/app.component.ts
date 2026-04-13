import { Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { Universe } from './services/universe.service';
import { NightSkyController } from './controller/NightSkyController';

const FOV = 40;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: false,
})
export class AppComponent {
  // Start
  cameraPos: number[] = [0, 3000, 0];

  // Three
  scene: any;
  camera: any;
  renderer: any;
  controls: any;
  dragControls: any;

  // Sim
  universe: Universe;

  // Controllers
  nightSky: NightSkyController = new NightSkyController(this);

  constructor() {
    this.setup();

    this.universe = new Universe(this.scene);

    this.initDragControls();
  }

  private setup(): void {
    this.initThree();
    this.nightSky.init();
    // this.nightSky.drawConstellations();
  }

  update() {}

  initThree(): void {
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      500000000000000000,
    );
    this.camera.position.set(
      this.cameraPos[0],
      this.cameraPos[1],
      this.cameraPos[2],
    );
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });

    // Add grid
    const gridSize = 100;
    const gridHelper = new THREE.GridHelper(gridSize * 20, 50);
    this.scene.add(gridHelper);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    let app = this;
    var animate = function () {
      requestAnimationFrame(animate);
      app.onWindowResize();
      app.update();
      app.renderer.render(app.scene, app.camera);
      app.controls.update();
      if (app.universe) {
        app.universe.update();
      }
    };

    animate();
  }

  initDragControls() {
    var objects: any[] = [];

    this.universe.systems.forEach((system) =>
      system.planets.forEach((p) => {
        objects.push(p.mesh);
        objects.push(p.velocityCone);
      }),
    );

    this.dragControls = new DragControls(
      [...objects],
      this.camera,
      this.renderer.domElement,
    );
    this.dragControls.addEventListener('drag', function (event: any) {
      switch (event.object.userData.type) {
        case 'planet':
          app.universe.updateFakePlanets();
          app.universe.updateVelocityConePositions();
          break;
          case 'velocityCone':
            app.universe.updateVelocityOfSelectedPlanet();
            app.universe.updateFakePlanets();
          break;
      }
    });

    let app = this;
    this.dragControls.addEventListener('dragstart', function (event: any) {
      app.controls.enabled = false;

      const planet =
        app.universe.systems
          .flatMap((s) => s.planets)
          .find((p) => p.mesh === event.object) ?? null;

      if (planet) {
        app.universe.selectPlanet(planet);
      }
    });
    this.dragControls.addEventListener('dragend', function () {
      app.controls.enabled = true;
    });
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  @HostListener('document:keydown', ['$event'])
  readKeyboardInput(event: KeyboardEvent) {
    // TimeStep (-, +)
    const stepSize = 0.5;
    if (event.key == '-') this.universe.timeStep -= stepSize;
    else if (event.key == '=') this.universe.timeStep += stepSize;
  }

  async simulate(n: number) {
    for (let i = 0; i < n; i++) {
      this.universe.doStep(this.universe.currentSystem!.planets);
    }
  }
}
