import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable} from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('jwt-token')

    if (!this.jwtHelper.isTokenExpired(token) && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}