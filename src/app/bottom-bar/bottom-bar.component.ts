import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-bottom-bar',
    standalone: true,
    imports: [],
    templateUrl: './bottom-bar.component.html',
    styleUrl: './bottom-bar.component.sass'
})
export class BottomBarComponent {
    @Input() universe: any;
}
