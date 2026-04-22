import * as THREE from 'three';
import { Planet } from '../models/planet.model';
import { System } from '../models/system.model';

export class Universe {
  systems: System[] = [];
  currentSystem: System | null = null;
  selectedPlanet: Planet | null = null;
  lastSelectedPlanet: Planet | null = null;

  preSimSteps: number = 1000;

  time: number = 0;
  timeStep: number = 0.5;
  paused: boolean = true;

  showingTrails: boolean = true;
  showingFakeTrails: boolean = true;

  constructor(private scene: any) {
    this.initStartSystems();
  }

  initStartSystems() {
    this.initThreeBodySystem();
    this.initStarSystem();
    this.initSolarSystem();
    this.initFigureEight();
    this.switchSystem(this.systems[0]);
  }

  initThreeBodySystem() {
    const size = 50;
    const planets = [
      new Planet(
        'Green planet',
        size,
        0x00ff00,
        new THREE.Vector3(-300, 0, 100),
        100,
        new THREE.Vector3(0, 0, -5),
        this,
      ),
      new Planet(
        'Red planet',
        size,
        0xff0000,
        new THREE.Vector3(300, 0, 100),
        100,
        new THREE.Vector3(-9, 0, 9),
        this,
      ),
      new Planet(
        'Blue planet',
        size,
        0x0000ff,
        new THREE.Vector3(0, 0, -300),
        100,
        new THREE.Vector3(5, 0, 0),
        this,
      ),
    ];
    this.systems.push(new System(planets, this, 'Three body system'));
  }

  initStarSystem() {
    const size = 50;

    const planets = [
      new Planet(
        'Yellow star',
        size * 2,
        0xffff00,
        new THREE.Vector3(0, 0, 0),
        5000,
        new THREE.Vector3(0, 0, 0),
        this,
      ),
      new Planet(
        'Cyan planet',
        size,
        0x00ffff,
        new THREE.Vector3(-500, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        'Green planet',
        size,
        0x00ff00,
        new THREE.Vector3(1000, 0, 0),
        10,
        new THREE.Vector3(0, 0, -57.9),
        this,
      ),
    ];
    this.systems.push(new System(planets, this, 'Star system'));
  }

  initSolarSystem() {
    const size = 20;

    const planets = [
      new Planet(
        'Sol',
        size * 2,
        0xffff00,
        new THREE.Vector3(0, 0, 0),
        5000,
        new THREE.Vector3(0, 0, 0),
        this,
      ),
      new Planet(
        'Mercury',
        size,
        0x777777,
        new THREE.Vector3(-100, 0, 0),
        10,
        new THREE.Vector3(0, 0, -58),
        this,
      ),
      new Planet(
        'Venus',
        size,
        0x7a381c,
        new THREE.Vector3(-200, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        'Earth',
        size,
        0x243e49,
        new THREE.Vector3(300, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        'Mars',
        size,
        0xac6349,
        new THREE.Vector3(-400, 0, 0),
        10,
        new THREE.Vector3(0, 0, -58),
        this,
      ),
      new Planet(
        'Jupiter',
        size * 2,
        0x9f8e7a,
        new THREE.Vector3(700, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        'Saturn',
        size * 2,
        0xb2915f,
        new THREE.Vector3(-800, 0, 0),
        10,
        new THREE.Vector3(0, 0, -58),
        this,
      ),
      new Planet(
        'Uranus',
        size * 2,
        0x8eb2c4,
        new THREE.Vector3(900, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        'Neptune',
        size * 2,
        0x4662f6,
        new THREE.Vector3(-1000, 0, 0),
        10,
        new THREE.Vector3(0, 0, -58),
        this,
      ),
    ];
    this.systems.push(new System(planets, this, 'Solar system'));
  }

  initFigureEight() {
    const scale = 309; // position scale factor
    const vScale = 12; // tune this to match your simulation's time step / G constant

    const v3x = -0.93240737 * vScale;
    const v3y = -0.86473146 * vScale;

    const planets = [
      new Planet(
        'Green planet',
        5,
        0x00ff00,
        new THREE.Vector3(-0.97000436 * scale, 0.24308753 * scale, 0),
        100,
        new THREE.Vector3(-v3x / 2, -v3y / 2, 0), // v1 = -v3/2
        this,
      ),
      new Planet(
        'Red planet',
        5,
        0xff0000,
        new THREE.Vector3(0.97000436 * scale, -0.24308753 * scale, 0),
        100,
        new THREE.Vector3(-v3x / 2, -v3y / 2, 0), // v2 = -v3/2 (same as v1)
        this,
      ),
      new Planet(
        'Blue planet',
        5,
        0x0000ff,
        new THREE.Vector3(0, 0, 0),
        100,
        new THREE.Vector3(v3x, v3y, 0), // v3
        this,
      ),
    ];
    this.systems.push(new System(planets, this, 'Figure eight'));
  }

  update() {
    if (this.paused) {
      return;
    }

    this.doStep(this.currentSystem!.planets);
  }

  togglePause() {
    this.paused = !this.paused;

    if (this.paused == false) {
      this.selectPlanet(null);
    } else {
      this.selectPlanet(this.lastSelectedPlanet);
    }

    this.setGridVisibility(this.paused);
  }

  setGridVisibility(vis: boolean) {
    this.scene.children.forEach((x: any) => {
      if (x instanceof THREE.GridHelper) {
        x.visible = vis;
      }
    });
  }

  updateFakePlanets() {
    this.currentSystem?.removeFakePlanetsFromScene(this.scene);

    this.currentSystem?.initFakePlanets();

    // Simulate
    for (let i = 0; i < this.preSimSteps; i++) {
      this.doStep(this.currentSystem!.fakePlanets);
    }

    this.currentSystem?.addFakePlanetsToScene(this.scene);
  }

  doStep(planets: Planet[]) {
    this.time += this.timeStep;

    planets.forEach((planet) => {
      planet.CalculateVelocity(planets);
    });

    planets.forEach((planet) => {
      if (!planet.exploded) {
        planet.movePlanet();

        planet.updateTrail();

        this.showingFakeTrails = true;

        planet.updateVelocityConePosition();
        planet.updateVelocityConeRotation();

        this.calculateCollisions(planets);
      }
    });
  }

  calculateCollisions(planets: Planet[]) {
    planets.forEach((p1) => {
      planets.forEach((p2) => {
        if (p1 == p2 || p1.exploded || p2.exploded) return;

        if (
          p1.mesh.position.distanceTo(p2.mesh.position) <=
          Math.max(p1.size, p2.size)
        ) {
          p1.explode(this.scene);
          p2.explode(this.scene);
        }
      });
    });
  }

  colDetec() {
    return (
      (this.currentSystem!.fakePlanets.filter((x) => x.exploded).length +
        this.currentSystem!.planets.filter((x) => x.exploded).length) /
      2
    );
  }

  checkForColInFuture() {
    var stepsDone = 0;
    while (!this.colDetec() && stepsDone < 10_000) {
      this.preSimSteps++;
      stepsDone++;
      this.doStep(this.currentSystem!.fakePlanets);
    }
  }

  switchSystem(newSystem: System) {
    this.currentSystem?.removeFromScene(this.scene);
    this.currentSystem = newSystem;
    this.selectedPlanet = null;
    newSystem.addPlanetsToScene(this.scene);
    this.updateFakePlanets();
  }

  selectPlanet(planet: Planet | null) {
    this.lastSelectedPlanet = this.selectedPlanet;

    if (this.lastSelectedPlanet) {
      this.lastSelectedPlanet.hideVelocityCone(this.scene);
    }

    this.lastSelectedPlanet = this.selectedPlanet;
    this.selectedPlanet = planet;

    if (planet) {
      planet.showVelocityCone(this.scene);
    }
  }

  updateVelocityConeRotations() {
    if (this.selectedPlanet) {
      this.selectedPlanet.updateVelocityConeRotation();
    }
  }

  updateVelocityConePositions() {
    if (this.selectedPlanet) {
      this.selectedPlanet.updateVelocityConePosition();
    }
  }

  updateVelocityOfSelectedPlanet() {
    if (this.selectedPlanet) {
      this.selectedPlanet.updateInitVelocity();
    }
  }

  showTrail() {
    this.currentSystem?.planets.forEach((p) => p.showTrail(this.scene));
  }

  hideTrail() {
    this.currentSystem?.planets.forEach((p) => p.hideTrail(this.scene));
  }

  toggleTrail() {
    this.showingTrails = !this.showingTrails;

    if (this.showingTrails) {
      this.showTrail();
    } else {
      this.hideTrail();
    }
  }

  showFakeTrail() {
    this.currentSystem?.fakePlanets.forEach((p) => p.showTrail(this.scene));
  }

  hideFakeTrail() {
    this.currentSystem?.fakePlanets.forEach((p) => p.hideTrail(this.scene));
  }

  toggleFakeTrail() {
    this.showingFakeTrails = !this.showingFakeTrails;

    if (this.showingFakeTrails) {
      this.showFakeTrail();
    } else {
      this.hideFakeTrail();
    }
  }
}
