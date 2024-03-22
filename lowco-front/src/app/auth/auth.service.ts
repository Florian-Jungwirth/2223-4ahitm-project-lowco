import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Observable, BehaviorSubject, firstValueFrom} from 'rxjs';

import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { API2_URL, CLIENT_ID, CLIENT_SECRET, CLIENT_UUID, KEYCLOAK_URL_ADMIN, KEYCLOAK_URL_TOKEN } from '../constants';
import { UserModel, UserLoginModel, RegisterModel, RegisterModelKeyCloak } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  async getToken() {
    if (await this.storage.get('ACCESS_TOKEN')) {
      return await this.storage.get('ACCESS_TOKEN');
    }
  }

  jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient, private storage: Storage, private router: Router) {
  }

  register(user: RegisterModel) {
    this.httpClient
      .post(`${API2_URL}user/register`, user)
      .subscribe()
  }

  registerKeyCloak(user: RegisterModelKeyCloak) {
    let self = this
    return new Observable(observer => {
      this.getKeyCloakToken().subscribe(clientToken => {

        let keyCloakUser = {
          "enabled": true,
          "email": user.email,
          "emailVerified": true,
          "firstName": user.firstname,
          "lastName": user.lastname,
          "username": user.username,
          "credentials": [{
            "type": "password",
            "value": user.password,
            "temporary": false
          }]
        }

        this.httpClient
          .post(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/users`, keyCloakUser, {headers: new HttpHeaders().set('authorization', "Bearer "+ clientToken.access_token)}).subscribe({
            next (data)  {
              let userLogin: UserLoginModel = {
                email: user.email,
                password: user.password
              }
              self.login(userLogin).subscribe(data => {

                let uid = self.jwtHelper.decodeToken(data.access_token).sub
                self.mapDefaultRole(uid, clientToken.access_token)

                let register: RegisterModel = {
                  metric: true,
                  id: uid
                }
                self.register(register)
              })

              observer.next(data)
            },
            error(error) {
              observer.error(error)
            },
            complete() {
              observer.complete()
            }
          })
        })
    })
  }

  mapDefaultRole(uid: string, token: string) {
    this.httpClient.get(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/default`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)}).subscribe((role) => {
      this.mapRole(role, uid, token)
    })
  }

  mapRole(role: Object, uid: string, token: string) {
    this.httpClient.post(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/users/${uid}/role-mappings/clients/${CLIENT_UUID}`, [role], {headers: new HttpHeaders().set('authorization', "Bearer "+ token)}).subscribe()
  }

  getKeyCloakToken(): Observable<any> {
    let body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('client_secret', CLIENT_SECRET)
      .set('grant_type', 'client_credentials');


    return this.httpClient.post(`${KEYCLOAK_URL_TOKEN}realms/lowco2_realm/protocol/openid-connect/token`, body.toString(), {"headers": new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')})
  }

  login(user: UserLoginModel): Observable<any> {
      let body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('client_secret', CLIENT_SECRET)
      .set('grant_type', 'password')
      .set('username', user.email)
      .set('password', user.password);

      return this.httpClient.post(`${KEYCLOAK_URL_TOKEN}realms/lowco2_realm/protocol/openid-connect/token`, body.toString(), {"headers": new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')})
  }

  logout() {
    sessionStorage.removeItem('jwt-token');
    this.router.navigate(['login'])
  }

  isUserAdmin() {
    let user = this.getUserKeyCloak()
    return user?.resource_access?.lowco2_client?.roles?.includes('admin')
  }

  getUserKeyCloak():any {
    let token = sessionStorage.getItem('jwt-token')

    if(!this.jwtHelper.isTokenExpired(token) && token) {
      return this.jwtHelper.decodeToken(token)
    } else {
      this.logout()
    }
  }

  async getAllUsersKeycloak() {
    let token = (await firstValueFrom(this.getKeyCloakToken())).access_token
    return this.httpClient.get<any>(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }

  async getAllDefaultUsersKeycloak() {
    let token = (await firstValueFrom(this.getKeyCloakToken())).access_token
    return this.httpClient.get<any>(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/default/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }

  async getAllAdminUsersKeycloak() {
    let token = (await firstValueFrom(this.getKeyCloakToken())).access_token
    return this.httpClient.get<any>(`${KEYCLOAK_URL_ADMIN}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/admin/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }
}
