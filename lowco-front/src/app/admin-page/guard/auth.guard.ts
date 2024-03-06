import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router
  ) {}

  jwtHelper = new JwtHelperService();


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {    
    let token = sessionStorage.getItem('jwt-token')
      
    if(this.jwtHelper.isTokenExpired(token)) {
      this.router.navigateByUrl('login')
      return false;
    }
    
    return true;
  }
}
