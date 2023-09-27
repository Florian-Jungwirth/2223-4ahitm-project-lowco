import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLogin } from './userLogin';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async isAuthenticated(): Promise<boolean> {
    if (!(await this.isSessionExpired())) {
      let user = await this.getUser();

      return new Promise<boolean>((resolve) => {
        this.httpClient
          .get(`${API_URL}user/` + user.id)
          .subscribe({
            next: () => {
              resolve(true);
            },
            error: () => {
              resolve(false);
            },
          });
      });
    } else {
      return false;
    }
  }

  async isSessionExpired() {
    if (await this.getToken()) {
      return await this.jwtHelper.decodeToken(this.getToken()).then((res) => {
        return !(res.exp > Math.floor(Date.now() / 1000));
      });
    }
    return true;
  }

  async getToken() {
    if (await this.storage.get('ACCESS_TOKEN')) {
      return await this.storage.get('ACCESS_TOKEN');
    }
  }
  
  authSubject = new BehaviorSubject(false);
  jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.createStorage();
  }

  async createStorage() {
    await this.storage.create();
  }

  register(user: User): Observable<any> {
    return this.httpClient
      .post(`${API_URL}auth/register`, user)
      .pipe(tap(async (res: any) => {}));
  }

  login(user: UserLogin): Observable<any> {
    return this.httpClient
      .post(`${API_URL}auth/login`, user)
      .pipe(
        tap(async (res: any) => {
          if (res.token) {
            await this.storage.create();
            await this.storage.set('ACCESS_TOKEN', res.token);
            this.authSubject.next(true);
          }
        })
      );
  }

  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    this.authSubject.next(false);
  }

  async isUserAdmin() {
    let user = await this.getUser()

    return user.isAdmin == 1
  }

  async getUserProfile() {
    let user = await this.getUser();
    const profile = {id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, username: user.username};

    return profile;
  }

  async updateUserEmail(userId: string, email: string) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .patch(`${API_URL}user/changeEmail/${userId}`, {email: email})
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async updateName(userId: string, firstname: string, lastname: string) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .patch(`${API_URL}user/changeName/${userId}`, {firstname: firstname, lastname: lastname})
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async updateUserPassword(userId: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .patch(`${API_URL}user/changePW/${userId}`, {pw: password})
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  async getUser() {
    return new Promise<any>(async (resolve) => {
      this.httpClient
        .get(`${API_URL}user/` + (await this.jwtHelper.decodeToken(this.getToken())).user.id)
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            resolve(error);
          },
        });
    });
  }

  async updateMetric(userId: string, metric: number) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .patch(`${API_URL}user/${userId}`, {metric: metric})
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
