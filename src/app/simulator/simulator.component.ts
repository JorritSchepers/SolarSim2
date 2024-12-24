import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Universe } from '../services/universe.service';

@Component({
    selector: 'app-simulator',
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.sass']
})
export class SimulatorComponent {
    universe: Universe;

    constructor(private app: AppComponent) {
        this.universe = app.universe;
    }

    simulate(n: number) {
        for (let i = 0; i < n; i++) {
            this.universe.doStep(this.universe.planets);
        }
    }

    updatePreSimSteps(n: number) {
        this.universe.preSimSteps += n;
        this.universe.updateFakePlanets()
    }

    updateXForFirstPlanet(x: number) {
        const p = this.universe.planets[0];
        p.updatePos(p.mesh.position.x + x, p.mesh.position.y, p.mesh.position.z);
        this.universe.updateFakePlanets();
    }
}
