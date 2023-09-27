import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitySelectionPage } from './category-selection.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitySelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitySelectionPageRoutingModule {}
