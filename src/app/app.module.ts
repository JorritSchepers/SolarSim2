import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { Universe } from './services/universe.service';
import { TopBarComponent } from "./top-bar/top-bar.component";
import { CollisionWarningComponent } from "./collision-warning/collision-warning.component";
import { BottomBarComponent } from "./bottom-bar/bottom-bar.component";

@NgModule({
    declarations: [
        AppComponent,
        SimulatorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TopBarComponent,
        CollisionWarningComponent,
        BottomBarComponent
    ],
    providers: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
