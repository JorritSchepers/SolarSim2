import * as THREE from 'three';
import { Planet } from '../models/planet.model';
import { System } from '../models/system.model';

export class Universe {
  systems: System[] = [];
  currentSystem: System | null = null;

  preSimSteps: number = 1000;

  time = 0;
  timeStep = 0.5;
  paused = true;

  constructor(private scene: any) {
    this.initStartSystems();
    this.switchSystem(this.systems[0]);
  }

  initStartSystems() {
    const size = 50;

    this.initThreeBodySystem();

    this.initStarSystem();
  }

  initThreeBodySystem() {
    const size = 50;
    const planets = [
      new Planet(
        size,
        0x00ff00,
        new THREE.Vector3(-300, 0, 100),
        100,
        new THREE.Vector3(0, 0, -5),
        this,
      ),
      new Planet(
        size,
        0xff0000,
        new THREE.Vector3(300, 0, 100),
        100,
        new THREE.Vector3(-5, 0, 5),
        this,
      ),
      new Planet(
        size,
        0x0000ff,
        new THREE.Vector3(0, 0, -300),
        100,
        new THREE.Vector3(5, 0, 0),
        this,
      ),
    ];
    this.systems.push(new System(planets, this, "Three body system"));
  }

  initStarSystem() {
    const size = 50;

    const planets = [
      new Planet(
        size * 2,
        0xffff00,
        new THREE.Vector3(0, 0, 0),
        5000,
        new THREE.Vector3(0, 0, 0),
        this,
      ),
      new Planet(
        size,
        0x00ffff,
        new THREE.Vector3(-500, 0, 0),
        10,
        new THREE.Vector3(0, 0, 58),
        this,
      ),
      new Planet(
        size,
        0x00ff00,
        new THREE.Vector3(1000, 0, 0),
        10,
        new THREE.Vector3(0, 0, -57.9),
        this,
      ),
    ];
    this.systems.push(new System(planets, this, "Star system"));
  }

  initStartPlanets() {
    this.updateFakePlanets();
  }

  update() {
    if (this.paused) {
      return;
    }

    this.doStep(this.currentSystem!.planets);
  }

  togglePause() {
    this.paused = !this.paused;

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
        planet.MovePlanet();
        planet.updateTrail();
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
          p1.exploded = true;
          p2.exploded = true;
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
    newSystem.addPlanetsToScene(this.scene);
    this.initStartPlanets();
  }
}
