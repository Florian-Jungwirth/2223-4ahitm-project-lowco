import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import {AuthService} from "../auth/auth.service";
import { API_URL } from "../constants";

@Injectable({
    providedIn: 'root',
})

export class ProfileService {
    Helper = new JwtHelperService();

    constructor(private httpClient: HttpClient, private authService: AuthService) {
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
