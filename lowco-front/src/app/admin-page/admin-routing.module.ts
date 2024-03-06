import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then(
            (m) => m.HomePageModule
          ),
      },
      {
        path: 'survey',
        loadChildren: () =>
          import('./survey/survey.module').then(
            (m) => m.SurveyPageModule
          ),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then(
            (m) => m.CategoryPageModule
          ),
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
