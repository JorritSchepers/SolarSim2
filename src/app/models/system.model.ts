import { effect } from '@angular/core';
import { Universe } from '../services/universe.service';
import { Planet } from './planet.model';

export class System {
  static systemCounter = 1;
  name: string;

  fakePlanets: Planet[] = [];

  constructor(public planets: Planet[], public universe: Universe, name?: string) {
    if (name != null) {
      this.name = name;
    } else {
      this.name = 'System ' + System.systemCounter;
    }

    this.initFakePlanets();
    System.systemCounter++;

    effect(() => {
      if (this.universe.currentSystem() != this) {
        return
      }
      
      if (this.universe.showingTrails()) {
        this.planets.forEach((p) => p.showTrail(this.universe.scene));
      } else {
        this.planets.forEach((p) => p.hideTrail(this.universe.scene));
      }
    });

    effect(() => {
      if (this.universe.currentSystem() != this) {
        return
      }

      if (this.universe.showingFakeTrails()) {
        this.fakePlanets.forEach((p) => p.showTrail(this.universe.scene));
      } else {
        this.fakePlanets.forEach((p) => p.hideTrail(this.universe.scene));
      }
    });
  }

  addPlanetsToScene(scene: any) {
    this.planets.forEach((p) => p.addToScene(scene, this.universe.showingTrails()));
    this.fakePlanets.forEach((p) => p.addToScene(scene, this.universe.showingFakeTrails()));
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
    this.fakePlanets.forEach((p) => p.addToScene(scene, this.universe.showingFakeTrails()));
  }

  removeFakePlanetsFromScene(scene: any) {
    this.fakePlanets.forEach((p) => p.removeFromScene(scene));
  }

  removeFromScene(scene: any) {
    this.planets.forEach((p: Planet) => {
      p.removeFromScene(scene);
      p.hideVelocityCone(scene);
    });
    this.fakePlanets.forEach((p) => p.removeFromScene(scene));
  }
}
