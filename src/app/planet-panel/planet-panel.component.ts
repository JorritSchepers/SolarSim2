import { Component, Input } from '@angular/core';
import { Planet } from '../models/planet.model';

@Component({
  selector: 'app-planet-panel',
  imports: [],
  templateUrl: './planet-panel.component.html',
  styleUrl: './planet-panel.component.sass',
})
export class PlanetPanelComponent {
  @Input() planet!: Planet;

  positionToString() {
    return `x: ${Math.round(this.planet.mesh.position.x)}, y: ${Math.round(this.planet.mesh.position.y)}, z: ${Math.round(this.planet.mesh.position.z)}`;
  }
}
