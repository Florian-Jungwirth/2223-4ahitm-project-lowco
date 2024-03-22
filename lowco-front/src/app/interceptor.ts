import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem('jwt-token')

    if(!this.jwtHelper.isTokenExpired(token) && token) {
      
      const modifiedRequest = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + token
        }
      });

    return next.handle(modifiedRequest);
    } else {
      this.authService.logout()

      return of()
    }
    

  }
}