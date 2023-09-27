import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UserManagmentService {

  constructor(
    private httpClient: HttpClient
  ) {}

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
}
