import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API2_URL} from '../constants';
import { RegisterModel } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getUserByID(id: string): Observable<RegisterModel> {
    return this.httpClient.get<RegisterModel>(`${API2_URL}user/getByID/6bb773ee-8071-49c1-afa7-ca51472670dd`)
  }

  updateMetric(user: RegisterModel) {
    return this.httpClient.put(`${API2_URL}user/updateUser`, user)
  }

  searchUserByEmail(users: any[], search: string) {
    let selectedUsers = []

    if(search == '') {
      return users;
    }

    for (const user of users) {
      if(String(user.email).toLowerCase().includes(search)) {
        selectedUsers.push(user)
      }
    }
    return selectedUsers
  }
}
