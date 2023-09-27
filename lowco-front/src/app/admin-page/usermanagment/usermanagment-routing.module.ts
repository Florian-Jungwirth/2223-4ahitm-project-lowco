import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermanagmentPage } from './usermanagment.page';

const routes: Routes = [
  {
    path: '',
    component: UsermanagmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermanagmentPageRoutingModule {}
