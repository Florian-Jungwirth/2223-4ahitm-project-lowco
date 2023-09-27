import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: 'lowco',
    component: PagesPage,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'activities',
        loadChildren: () =>
          import('./category-selection/category-selection.module').then(
            (m) => m.ActivitySelectionPageModule
          ),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./survey-selection/survey-selection.module').then(
            (m) => m.CategoryPageModule
          ),
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/lowco',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
