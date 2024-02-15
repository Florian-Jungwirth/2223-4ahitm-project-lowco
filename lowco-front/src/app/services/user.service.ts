import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {API2_URL, API_URL} from '../constants';
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
    return this.httpClient.get<RegisterModel>(`${API2_URL}user/getByID/${id}`)
  }

  updateMetric(user: RegisterModel) {
    return this.httpClient.put(`${API2_URL}user/updateUser`, user)
  }
}
