import * as THREE from 'three';
import { Universe } from '../services/universe.service';

const DETAIL = 32;

export class Planet {
    geometry: any;
    material: any;
    mesh: any;
    velocity: THREE.Vector3;
    velocityArrow: any;

    constructor(private size: number, private color: number, private pos: THREE.Vector3, public mass: number, initVelocity: THREE.Vector3, private scene: any, private universe: Universe) {
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
                this.velocity.addScaledVector(acceleration, this.universe.timeStep);
            }
        });
    }

    MovePlanet() {
        this.mesh.position.addScaledVector(this.velocity, this.universe.timeStep);
        // this.mesh.velocity = this.velocity;
    }

    velocityToString() {
        return `x: ${Math.round(this.velocity.x)}, y: ${Math.round(this.velocity.y)}, z: ${Math.round(this.velocity.z)}`;
        return `x: ${this.velocity.x}, y: ${this.velocity.y}, z: ${this.velocity.z}`;
    }

    initVelocityArrow() {
        const g = new THREE.ConeGeometry(10, 400)
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.velocityArrow = new THREE.Mesh(g, m)
        this.scene.add(this.velocityArrow)
        console.log(this.velocityArrow)
    }

    drawVelocityArrow() {
        if (!this.velocityArrow) this.initVelocityArrow();

        this.velocityArrow.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)

        this.velocityArrow.rotation.z = Math.PI * .5
        const rotY = this.getRotationFromVelocity()
        this.velocityArrow.rotation.y = rotY
    }

    getRotationFromVelocity() {
        // console.log(thi÷s.velocity)
        if (this.color == 0xff0000) return
        const x = Math.abs(this.velocity.x)
        const z = Math.abs(this.velocity.z)
        const sum = x + z
        const xF = x / sum
        const zF = z / sum
        console.log(xF)

        return (Math.PI * sum) - Math.PI * 2


        return 0
    }
}
