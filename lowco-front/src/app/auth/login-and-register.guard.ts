import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class LoginAndRegisterGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {    
    return await this.checkAuth();
  }
  private async checkAuth() {
    const authed = await this.authService.isAuthenticated();
    return authed || this.routeToLogin();
  }
  private routeToLogin(): boolean {
    this.router.navigateByUrl('/login');
    return false;
  }
}
