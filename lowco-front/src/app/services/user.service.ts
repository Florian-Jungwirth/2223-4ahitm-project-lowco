import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API_URL} from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getAllUsers(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.httpClient.get(`${API_URL}user/all`).subscribe({
        next: (data) => {
          resolve(data);
        },
      });
    });
  }

  getUserByEmail(users: any, search: string): any[] {
    let selectedUsers = [];
    for (const user of users) {
      if (user.email.toLowerCase().includes(search.toLowerCase())) {
        selectedUsers.push(user);
      }
    }
    return selectedUsers;
  }

  getUserProfile(id: any): Promise<any> {
    return new Promise<any>((resolve => {
      this.httpClient
        .get(`${API_URL}user/${id}`)
        .subscribe({
          next: (data) => {
            resolve(data);
          }
        });
    }));
  }

  changePassword(id: any, hashedPassword: string) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch(`${API_URL}user/changePW/${id}`, hashedPassword).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      })
    })
  }

  changeEmail(id: any, email: string) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch(`${API_URL}user/changeEmail/${id}`, email).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      })
    })
  }
}
