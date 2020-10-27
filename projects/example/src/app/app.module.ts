import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxLocationViewerModule } from '../../../../dist/ngx-location-viewer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxLocationViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
