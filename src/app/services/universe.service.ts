import * as THREE from 'three';
import { Planet } from '../models/planet.model';
import { System } from '../models/system.model';

export class Universe {
    systems: System[] = [];
    currentSystem: System | null = null;

    preSimSteps: number = 1000;

    time = 0
    timeStep = 0.5;
    paused = true;

    constructor(private scene: any) {
        this.initStartSystems();
        this.initStartPlanets();
    }

    initStartSystems() {
        const size = 50;

        // const rgbSystem = [
        //     new Planet(size, 0x00ff00, new THREE.Vector3(-300, 0, 100), 100, new THREE.Vector3(0, 0, -5), this.scene, this),
        //     new Planet(size, 0xff0000, new THREE.Vector3(300, 0, 100), 100, new THREE.Vector3(-5, 0, 5), this.scene, this),
        //     new Planet(size, 0x0000ff, new THREE.Vector3(0, 0, -300), 100, new THREE.Vector3(5, 0, 0), this.scene, this),
        // ]         
        // this.systems.push(new System(rgbSystem));

        const bigSol = [
            new Planet(size, 0xffff00, new THREE.Vector3(0, 0, 0), 5000, new THREE.Vector3(0, 0, 0), this.scene, this),
            new Planet(size, 0x00ffff, new THREE.Vector3(-500, 0, 0), 10, new THREE.Vector3(0, 0, 58), this.scene, this),
            new Planet(size, 0x00ff00, new THREE.Vector3(1000, 0, 0), 10, new THREE.Vector3(0, 0, -57.9), this.scene, this),
        ]         
        this.systems.push(new System(bigSol));

        this.currentSystem = this.systems[0];
    }

    initStartPlanets() {
        this.updateFakePlanets()
    }

    update() {
        if (this.paused) {
            return
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
        })
    }

    updateFakePlanets() {
        this.currentSystem!.fakePlanets.forEach(x => {
            this.scene.remove(x.mesh);
            this.scene.remove(x.trail);
        })

        this.initFakePlanets()

        // Simulate
        for (let i = 0; i < this.preSimSteps; i++) {
            this.doStep(this.currentSystem!.fakePlanets);
        }

    }

    initFakePlanets() {
        // Copy
        this.currentSystem!.fakePlanets = this.currentSystem!.planets.map(p => new Planet(
            p.size,
            p.color,
            p.mesh.position.clone(),
            p.mass,
            p.velocity.clone(),
            this.scene,
            this
        ));

        // Decrease brightness
        this.currentSystem!.fakePlanets.forEach(p => {
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

    colDetec() {
        return (this.currentSystem!.fakePlanets.filter(x => x.exploded).length + this.currentSystem!.planets.filter(x => x.exploded).length) / 2;
    }

    checkForColInFuture() {
        var stepsDone = 0;
        while (!this.colDetec() && stepsDone < 10_000) {
            this.preSimSteps++;
            stepsDone++;
            this.doStep(this.currentSystem!.fakePlanets)
        }
    }
}
