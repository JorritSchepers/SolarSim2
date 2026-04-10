import { Planet } from "./planet.model";

export class System {
    planets: Planet[] = [];
    fakePlanets: Planet[] = [];

    constructor(planets: Planet[]) {
        this.planets = planets;
    }
}