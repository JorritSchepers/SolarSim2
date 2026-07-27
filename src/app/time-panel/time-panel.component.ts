import { Component, Input } from '@angular/core';
import { Universe } from '../services/universe.service';
import { BrowserModule } from '@angular/platform-browser';

const SPEED_1 = 0.1;
const SPEED_2 = 0.5;
const SPEED_3 = 1;

@Component({
  selector: 'app-time-panel',
  imports: [BrowserModule],
  templateUrl: './time-panel.component.html',
  styleUrl: './time-panel.component.sass',
})
export class TimePanelComponent {
  @Input() universe!: Universe;

  speeds = [SPEED_1, SPEED_2, SPEED_3];

  pause() {
    this.universe.togglePause();
  }

  changeSpeed(speed: number) {
    this.universe.timeStep = this.speeds[speed - 1];
  }
}
