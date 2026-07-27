import { Component, Input } from '@angular/core';
import { Universe } from '../services/universe.service';

@Component({
  selector: 'app-bottom-bar',
  imports: [],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.sass',
})
export class BottomBarComponent {
  @Input() universe!: Universe;

  toggleLines() {
    this.universe.showingTrails.update((x) => x = !x);
  }

  toggleFakeLines() {
    this.universe.showingFakeTrails.update((x) => x = !x);
  }
}
