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
  isFake: boolean = false;

  n: number = 0;

  velocityCone: any;

  list: THREE.Vector3[] = [];

  constructor(
    public name: string,
    public size: number,
    public color: number,
    public pos: THREE.Vector3,
    public mass: number,
    private initVelocity: THREE.Vector3,
    private universe: Universe,
    fake?: boolean,
  ) {
    if (fake) this.isFake = fake;
    this.velocity = initVelocity;

    this.geometry = new THREE.SphereGeometry(this.size, DETAIL, DETAIL);
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData.type = 'planet';
    this.mesh.position.set(pos.x, pos.y, pos.z);

    this.initVelocityCone();
  }

  updateInitVelocity() {
    const direction = new THREE.Vector3().subVectors(
      this.velocityCone.position,
      this.mesh.position,
    );

    this.initVelocity.copy(direction.divideScalar(30));
    this.velocity.copy(this.initVelocity);

    this.updateVelocityConeRotation();
  }

  initVelocityCone() {
    const g = new THREE.ConeGeometry(this.size / 2, this.size, DETAIL);
    const m = new THREE.MeshBasicMaterial({ color: this.color });
    this.velocityCone = new THREE.Mesh(g, m);
    this.velocityCone.userData.type = 'velocityCone';
    this.updateVelocityConePosition();
    this.updateVelocityConeRotation();
  }

  CalculateVelocity(planets: Planet[]) {
    planets.forEach((planet) => {
      if (planet != this && !planet.exploded) {
        const g = 0.66743;
        const r = this.mesh.position.distanceTo(planet.mesh.position);
        const forceDir = new THREE.Vector3()
          .subVectors(planet.mesh.position, this.mesh.position)
          .normalize();
        const acceleration = forceDir.multiplyScalar((g * planet.mass) / r);
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
    let material = new THREE.LineBasicMaterial({
      color: this.color,
      linewidth: 200,
    });
    this.trail = new THREE.Line(trailGeometry, material);
  }

  updateTrail() {
    if (!this.trail) this.initTrail();
    this.n++;
    if (this.n % 4 != 0) return;

    this.list.push(this.mesh.position.clone());
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.list);
    this.trail.geometry = trailGeometry;
  }

  addToScene(scene: any) {
    if (this.exploded || !this.isFake) {
      scene.add(this.mesh);
    }
    scene.add(this.trail);
  }

  removeFromScene(scene: any) {
    scene.remove(this.mesh);
    scene.remove(this.trail);
  }

  showVelocityCone(scene: any) {
    scene.add(this.velocityCone);
  }

  hideVelocityCone(scene: any) {
    scene.remove(this.velocityCone);
  }

  updateVelocityConeRotation() {
    const dir = this.initVelocity.clone().normalize();

    // Align the cone's Y axis (default up) with the velocity direction
    this.velocityCone.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );
  }

  updateVelocityConePosition() {
    this.velocityCone.position.set(
      this.mesh.position.x + this.initVelocity.x * 30,
      this.mesh.position.y + this.initVelocity.y * 30,
      this.mesh.position.z + this.initVelocity.z * 30,
    );
  }

  explode(scene: any) {
    this.exploded = true
    this.hideVelocityCone(scene);
  }
}
