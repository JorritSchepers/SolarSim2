import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    imports: [],
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.component.sass'
})
export class TopBarComponent {
    @Input() universe: any;

}
