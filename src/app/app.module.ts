import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { Universe } from './services/universe.service';

@NgModule({
    declarations: [
        AppComponent,
        SimulatorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
