import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class NgrokInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Append the header to the request
    const modifiedRequest = request.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': '29'
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}