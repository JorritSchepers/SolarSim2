import * as THREE from 'three';
import { Universe } from '../services/universe.service';

const DETAIL = 32;

export class Planet {
    geometry: any;
    material: any;
    mesh: any;
    velocity: THREE.Vector3;
    trail: any;
    exploded: boolean = false;

    n: number = 0;

    list: THREE.Vector3[] = [];

    constructor(public size: number, public color: number, public pos: THREE.Vector3, public mass: number, initVelocity: THREE.Vector3, private scene: any, private universe: Universe) {
        this.velocity = initVelocity;

        this.geometry = new THREE.SphereGeometry(this.size, DETAIL, DETAIL);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(pos.x, pos.y, pos.z)
        this.scene.add(this.mesh);
    }

    CalculateVelocity(planets: Planet[]) {
        planets.forEach(planet => {
            if (planet != this && !planet.exploded) {
                const g = 0.66743;
                const r = this.mesh.position.distanceTo(planet.mesh.position);
                const forceDir = new THREE.Vector3().subVectors(planet.mesh.position, this.mesh.position).normalize();
                const acceleration = forceDir.multiplyScalar(g * planet.mass / r);
                this.velocity.addScaledVector(acceleration, this.universe.timeStep);
            }
        });
    }

    updatePos(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    }

    MovePlanet() {
        this.mesh.position.addScaledVector(this.velocity, this.universe.timeStep);
    }

    initTrail() {
        const points: THREE.Vector3[] = [];
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({ color: this.color, linewidth: 200 });
        this.trail = new THREE.Line(trailGeometry, material);
        this.scene.add(this.trail);
    }

    updateTrail() {
        if (!this.trail) this.initTrail();
        this.n++;
        if (this.n % 4 != 0) return;

        this.list.push(this.mesh.position.clone());
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.list);
        this.trail.geometry = trailGeometry;
    }
}