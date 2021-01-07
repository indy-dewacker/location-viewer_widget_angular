import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LocationViewerModule } from 'projects/ngx-location-viewer/src/lib/ngx-location-viewer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LocationViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
