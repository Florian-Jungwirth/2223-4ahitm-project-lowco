import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AdminGuard} from './admin-page/guard/admin.guard';
import { AuthGuard } from './admin-page/guard/auth.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-page/admin.module').then(m => m.AdminPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }


  /*
  {
    path: 'login',
    loadChildren: () => import('./loginAndRegistration/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./loginAndRegistration/registration/registration.module').then( m => m.RegistrationPageModule)
  },
*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
