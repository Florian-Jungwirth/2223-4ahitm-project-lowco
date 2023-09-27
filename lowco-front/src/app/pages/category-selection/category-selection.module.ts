import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitySelectionPageRoutingModule } from './category-selection-routing.module';

import { ActivitySelectionPage } from './category-selection.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitySelectionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ActivitySelectionPage]
})
export class ActivitySelectionPageModule {}
