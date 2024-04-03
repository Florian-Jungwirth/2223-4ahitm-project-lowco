import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AuthModule} from './auth/auth.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { Interceptor } from './interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AuthModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
