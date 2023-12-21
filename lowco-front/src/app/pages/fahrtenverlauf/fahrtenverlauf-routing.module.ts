import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FahrtenverlaufPage } from './fahrtenverlauf.page';

const routes: Routes = [
  {
    path: '',
    component: FahrtenverlaufPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FahrtenverlaufPageRoutingModule {}
