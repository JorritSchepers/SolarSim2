import * as THREE from 'three';
import { Planet } from '../models/planet.model';

export class Universe {
    planets: Planet[] = [];
    fakePlanets: Planet[] = [];

    preSimSteps: number = 1000;

    time = 0
    timeStep = 0.5;
    paused = true;

    constructor(private scene: any) {
        this.initStartPlanets();
    }

    initStartPlanets() {
        const size = 50;
        this.planets.push(new Planet(size, 0x00ff00, new THREE.Vector3(-300, 0, 100), 100, new THREE.Vector3(0, 0, -5), this.scene, this))
        this.planets.push(new Planet(size, 0xff0000, new THREE.Vector3(300, 0, 100), 100, new THREE.Vector3(-5, 0, 5), this.scene, this))
        this.planets.push(new Planet(size, 0x0000ff, new THREE.Vector3(0, 0, -300), 100, new THREE.Vector3(5, 0, 0), this.scene, this))
        this.updateFakePlanets()
    }

    update() {
        if (this.paused) return

        this.doStep(this.planets);
        // this.doStep(this.fakePlanets);

    }

    updateFakePlanets() {
        this.fakePlanets.forEach(x => {
            this.scene.remove(x.mesh);
            this.scene.remove(x.trail);
        })

        this.initFakePlanets()

        // Simulate
        for (let i = 0; i < this.preSimSteps; i++) {
            this.doStep(this.fakePlanets);
        }

    }

    initFakePlanets() {
        // Copy
        this.fakePlanets = this.planets.map(p => new Planet(
            p.size,
            p.color,
            p.mesh.position.clone(),
            p.mass,
            p.velocity.clone(),
            this.scene,
            this
        ));

        // Decrease brightness
        this.fakePlanets.forEach(p => {
            p.material.color.multiplyScalar(0.05);
        });
    }

    doStep(planets: Planet[]) {
        this.time += this.timeStep

        planets.forEach(planet => {
            planet.CalculateVelocity(planets)
        });


        planets.forEach(planet => {
            if (!planet.exploded) {
                planet.MovePlanet()
                planet.updateTrail()
                this.calculateCollisions(planets);
            }
        });
    }

    calculateCollisions(planets: Planet[]) {
        planets.forEach(p1 => {
            planets.forEach(p2 => {
                if (p1 == p2 || p1.exploded || p2.exploded) return;

                if (p1.mesh.position.distanceTo(p2.mesh.position) <= Math.max(p1.size, p2.size)) {
                    p1.exploded = true;
                    p2.exploded = true;
                }
            })
        })
    }
}
