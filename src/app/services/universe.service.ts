import * as THREE from 'three';
import { Planet } from '../models/planet.model';

export class Universe {
    planets: Planet[] = [];

    time = 0
    timeStep = 0.1;

    constructor(private scene: any) {
        this.initStartPlanets();
    }

    initStartPlanets() {
        const size = 50;
        this.planets.push(new Planet(size, 0x00ff00, new THREE.Vector3(-300, 0, 0), 100, new THREE.Vector3(0, 0, -1), this.scene, this))
        this.planets.push(new Planet(size, 0xff0000, new THREE.Vector3(300, 0, 0), 100, new THREE.Vector3(0, 0, 1), this.scene, this))
        // this.planets.push(new Planet(size, 0x0000ff, new THREE.Vector3(0, 0, -200), 100, new THREE.Vector3(0, 0, 0), this.scene))
    }

    update() {
        this.time += this.timeStep
        this.planets.forEach(planet => {
            planet.CalculateVelocity(this.planets)
        });

        this.planets.forEach(planet => {
            planet.MovePlanet()
        });
    }

    getTime() {
        return Math.round(this.time)
    }
}
