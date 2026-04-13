import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.sass',
})
export class TopBarComponent {
  @Input() universe: any;

  getSystemByName(event: Event) {
    const name = (event.target as HTMLSelectElement).value;
    return this.universe.systems.find((s:any) => s.name === name);
  }
}
