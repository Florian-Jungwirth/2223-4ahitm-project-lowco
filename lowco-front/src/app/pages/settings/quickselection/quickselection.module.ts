import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickselectionPageRoutingModule } from './quickselection-routing.module';

import { QuickselectionPage } from './quickselection.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [QuickselectionPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        QuickselectionPageRoutingModule,
        ComponentsModule
    ]
})
export class QuickselectionPageModule {}
