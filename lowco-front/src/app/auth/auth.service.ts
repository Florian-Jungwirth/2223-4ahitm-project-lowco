import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, firstValueFrom} from 'rxjs';

import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { API2_URL, CLIENT_ID, CLIENT_SECRET, CLIENT_UUID, KEYCLOAK_URL } from '../constants';
import { UserLoginModel, RegisterModel, RegisterModelKeyCloak } from '../models/user.model';
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
          "emailVerified": false,
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
          .post(`${KEYCLOAK_URL}admin/realms/lowco2_realm/users`, keyCloakUser, {headers: new HttpHeaders().set('authorization', "Bearer "+ clientToken.access_token)}).subscribe({
            next (data)  {

              self.getKeyCloakUserByEmail(user.email, clientToken.access_token).subscribe((data: any) => {
                self.sendVerificationEmail(data[0].id, clientToken.access_token)
                self.mapDefaultRole(data[0].id, clientToken.access_token)
                let register: RegisterModel = {
                  metric: true,
                  id: data[0].id
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
    this.httpClient.get(`${KEYCLOAK_URL}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/default`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)}).subscribe((role) => {
      this.mapRole(role, uid, token)
    })
  }

  mapRole(role: Object, uid: string, token: string) {
    this.httpClient.post(`${KEYCLOAK_URL}admin/realms/lowco2_realm/users/${uid}/role-mappings/clients/${CLIENT_UUID}`, [role], {headers: new HttpHeaders().set('authorization', "Bearer "+ token)}).subscribe()
  }

  getKeyCloakToken(): Observable<any> {
    let body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('client_secret', CLIENT_SECRET)
      .set('grant_type', 'client_credentials');


    return this.httpClient.post(`${KEYCLOAK_URL}realms/lowco2_realm/protocol/openid-connect/token`, body.toString(), {"headers": new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')})
  }

  sendVerificationEmail(uid: string, token: string) {
    this.httpClient.put(`${KEYCLOAK_URL}admin/realms/lowco2_realm/users/${uid}/execute-actions-email?redirect_uri=${encodeURIComponent(window.location.origin)}&client_id=lowco2_client`, null, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)}).subscribe()
  }

  getKeyCloakUserByEmail(email: string, token: string) {
    return this.httpClient.get(`${KEYCLOAK_URL}admin/realms/lowco2_realm/users?email=${email}`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }

  login(user: UserLoginModel): Observable<any> {
      let body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('client_secret', CLIENT_SECRET)
      .set('grant_type', 'password')
      .set('username', user.email)
      .set('password', user.password);

      return this.httpClient.post(`${KEYCLOAK_URL}realms/lowco2_realm/protocol/openid-connect/token`, body.toString(), {"headers": new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')})
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
    return this.httpClient.get<any>(`${KEYCLOAK_URL}admin/realms/lowco2_realm/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }

  async getAllDefaultUsersKeycloak() {
    let token = (await firstValueFrom(this.getKeyCloakToken())).access_token
    return this.httpClient.get<any>(`${KEYCLOAK_URL}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/default/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }

  async getAllAdminUsersKeycloak() {
    let token = (await firstValueFrom(this.getKeyCloakToken())).access_token
    return this.httpClient.get<any>(`${KEYCLOAK_URL}admin/realms/lowco2_realm/clients/${CLIENT_UUID}/roles/admin/users`, {headers: new HttpHeaders().set('authorization', "Bearer "+ token)})
  }
}
