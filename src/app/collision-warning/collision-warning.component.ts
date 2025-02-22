import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-collision-warning',
    standalone: true,
    imports: [],
    templateUrl: './collision-warning.component.html',
    styleUrl: './collision-warning.component.sass'
})
export class CollisionWarningComponent {
    @Input() count: number = 0;
}
