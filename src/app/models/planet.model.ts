import * as THREE from 'three';
import { Universe } from '../services/universe.service';

const DETAIL = 32;

export class Planet {
    geometry: any;
    material: any;
    mesh: any;
    velocity: THREE.Vector3;

    constructor(private size: number, private color: number, private pos: THREE.Vector3, private mass: number, initVelocity: THREE.Vector3, private scene: any, private universe: Universe) {
        this.velocity = initVelocity;

        this.geometry = new THREE.SphereGeometry(this.size, DETAIL, DETAIL);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        this.scene.add(this.mesh);
    }

    CalculateVelocity(planets: Planet[]) {
        planets.forEach(planet => {
            if (planet != this) {
                // const g = 0.000000000066743;
                const g = 0.66743;
                const r = this.mesh.position.distanceTo(planet.mesh.position);
                const forceDir = new THREE.Vector3().subVectors(planet.mesh.position, this.mesh.position).normalize();
                const acceleration = forceDir.multiplyScalar(g * planet.mass / r);
                this.velocity.add(acceleration.multiplyScalar(this.universe.timeStep));
            }
        });
    }

    MovePlanet() {
        this.mesh.position.add(this.velocity);
    }

    velocityToString() {
        return `x: ${Math.round(this.velocity.x)}, y: ${Math.round(this.velocity.y)}, z: ${Math.round(this.velocity.z)}`;
        return `x: ${this.velocity.x}, y: ${this.velocity.y}, z: ${this.velocity.z}`;
    }
}
