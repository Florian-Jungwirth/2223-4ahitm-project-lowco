import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {    
    return await this.checkAuth() && await this.authService.isUserAdmin();
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
