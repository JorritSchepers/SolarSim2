import { Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { Universe } from './services/universe.service';
import { NightSkyController } from './controller/NightSkyController';
import { MeshType } from './models/meshType.model';

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
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  orbitControls!: OrbitControls;

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
    this.nightSky.drawConstellations();
  }

  update() {}

  initThree(): void {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
    this.initGrid();
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    let app = this;
    var animate = function () {
      requestAnimationFrame(animate);
      app.onWindowResize();
      app.update();
      app.renderer.render(app.scene, app.camera);
      if (app.universe) {
        app.universe.update();
        // if (!app.universe.paused) {
        //   if (app.universe.currentSystem?.planets[3].velocity) {
        //     app.camera.position.x = app.universe.currentSystem?.planets[3].mesh.position.x
        //     app.camera.position.z = app.universe.currentSystem?.planets[3].mesh.position.z
        //     app.camera.lookAt(app.universe.currentSystem?.planets[3].mesh.position)
        //   }
        // }
      }
    };

    animate();
  }

  initGrid() {
    const gridSize = 100;
    const gridHelper = new THREE.GridHelper(gridSize * 20, 50);
    this.scene.add(gridHelper);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      500_000_000_000_000,
    );
    this.camera.position.set(
      this.cameraPos[0],
      this.cameraPos[1],
      this.cameraPos[2],
    );
    this.camera.lookAt(0, 0, 0);

    const cameraLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.camera.add(cameraLight);
    this.scene.add(this.camera);
  }

  initDragControls() {
    var objects: any[] = [];

    this.universe.systems.forEach((system) =>
      system.planets.forEach((p) => {
        objects.push(p.mesh);
        objects.push(p.velocityCone);
      }),
    );

    const dragControls = new DragControls(
      [...objects],
      this.camera,
      this.renderer.domElement,
    );

    this.initDragEventListeners(dragControls);
    this.initDragStartEventListener(dragControls);
    this.initDragEndEventListener(dragControls);
  }
  
  initDragEventListeners(dragControls: DragControls) {
    this.initDragPlanetEventListener(dragControls);
    this.initDragVelocityConePlanetEventListener(dragControls);
  }

  initDragPlanetEventListener(dragControls: DragControls) {
    const app = this;
    dragControls.addEventListener('drag', function (event: any) {
      if (event.object.userData.type != MeshType.Planet) {
        return;
      }
      app.universe.updateFakePlanets();
      app.universe.updateVelocityConePositions();
    });
  }

  initDragVelocityConePlanetEventListener(dragControls: DragControls) {
    const app = this;
    dragControls.addEventListener('drag', function (event: any) {
      if (event.object.userData.type != MeshType.VelocityCone) {
        return;
      }
      app.universe.updateVelocityOfSelectedPlanet();
      app.universe.updateFakePlanets();
    });
  }

  initDragStartEventListener(dragControls: DragControls) {
    const app = this;
    dragControls.addEventListener('dragstart', function (event: any) {
      app.orbitControls.enabled = false;
      
      const planet =
      app.universe.systems
      .flatMap((s) => s.planets)
      .find((p) => p.mesh === event.object) ?? null;
      
      if (planet) {
        app.universe.selectPlanet(planet);
      }
    });
  }

  initDragEndEventListener(dragControls: DragControls) {
    const app = this;
    dragControls.addEventListener('dragend', function () {
      app.orbitControls.enabled = true;
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
