import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CategoryPage} from './survey-selection.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {
}
