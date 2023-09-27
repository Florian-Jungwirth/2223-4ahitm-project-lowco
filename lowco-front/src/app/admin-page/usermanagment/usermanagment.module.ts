import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermanagmentPageRoutingModule } from './usermanagment-routing.module';

import { UsermanagmentPage } from './usermanagment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermanagmentPageRoutingModule
  ],
  declarations: [UsermanagmentPage]
})
export class UsermanagmentPageModule {}
