import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PagesPageRoutingModule} from './pages-routing.module';

import {PagesPage} from './pages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagesPageRoutingModule,
    NgOptimizedImage
  ],
  declarations: [PagesPage]
})
export class PagesPageModule {
}
