import { Universe } from '../services/universe.service';
import { Planet } from './planet.model';

export class System {
  static systemCounter = 1;
  name: string;

  planets: Planet[] = [];
  fakePlanets: Planet[] = [];

  universe: Universe;

  constructor(planets: Planet[], universe: Universe, name?: string) {
    if (name != null) {
      this.name = name;
    } else {
      this.name = 'System ' + System.systemCounter;
    }

    this.planets = planets;
    this.universe = universe;
    this.initFakePlanets();
    System.systemCounter++;
  }

  addPlanetsToScene(scene: any) {
    this.planets.forEach((p) => p.addToScene(scene));
    this.fakePlanets.forEach((p) => p.addToScene(scene));
  }

  initFakePlanets() {
    // Copy
    this.fakePlanets = this.planets.map(
      (p) =>
        new Planet(
          'Fake planet of ' + p.name,
          p.size,
          p.color,
          p.mesh.position.clone(),
          p.mass,
          p.velocity.clone(),
          this.universe,
          true,
        ),
    );

    // Decrease brightness
    this.fakePlanets.forEach((p) => {
      p.material.color.multiplyScalar(0.05);
    });
  }

  addFakePlanetsToScene(scene: any) {
    this.fakePlanets.forEach((p) => p.addToScene(scene));
  }

  removeFakePlanetsFromScene(scene: any) {
    this.fakePlanets.forEach((p) => p.removeFromScene(scene));
  }

  removeFromScene(scene: any) {
    this.planets.forEach((p) => p.removeFromScene(scene));
    this.fakePlanets.forEach((p) => p.removeFromScene(scene));
  }
}
