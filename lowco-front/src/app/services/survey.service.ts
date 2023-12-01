import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { API2_URL, API_URL, USER } from '../constants';
import { SurveyModel } from '../models/survey.model';
import { JoinedUserSurveyModel } from "../models/userSurvey.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getAllSurveys(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.httpClient.get(`${API_URL}survey`).subscribe({
        next: (data) => {
          resolve(data);
        },
      });
    });
  }

  updateSurvey(surveyId: number, survey: SurveyModel) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch(`${API_URL}survey/${surveyId}`, survey).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  getAllSurveysAdmin(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.httpClient.get(`${API_URL}survey/activated/allAdmin`).subscribe({
        next: (data) => {
          resolve(data);
        },
      });
    });
  }

  getAllActivatedSurveys(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.httpClient.get(`${API_URL}survey/activated/all`).subscribe({
        next: (data) => {
          resolve(data);
        },
      });
    });
  }

  getSurveyById(id: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(`${API_URL}survey/${id}`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }



  getSurveysByName(userSurveys: JoinedUserSurveyModel[], search: string): JoinedUserSurveyModel[] {
    let selectedSurveys = [];
    for (const userSurvey of userSurveys) {
      if (userSurvey.survey.title.toLowerCase().includes(search.toLowerCase())) {
        selectedSurveys.push(userSurvey);
      }
    }
    return selectedSurveys;
  }

  createNewSurvey(survey: SurveyModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(`${API_URL}survey`, survey).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  deleteSurvey(surveyId: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete(`${API_URL}survey/${surveyId}`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  updateUserSurvey(surveyId: number, value: number, unit: string) {
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user) => {
        this.httpClient
          .patch(
            `${API_URL}user-survey/${user.id}/${surveyId}/${value}/${unit}`,
            {}
          )
          .subscribe({
            next: (data) => {
              resolve(data);
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    });
  }

  addValueToUserSurvey(surveyId: number, value: number) {
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user) => {
        this.httpClient
          .patch(
            `${API_URL}user-survey/addValue/${user.id}/${surveyId}/${value}`,
            {}
          )
          .subscribe({
            next: (data) => {
              resolve(data);
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    });
  }

  getAllValuesByUser() {
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user) => {
        this.httpClient
          .get(`${API_URL}user-survey/getByUserAndSurvey/${user.id}`)
          .subscribe({
            next: (data) => {
              resolve(data);
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    });
  }

  getTypes() {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(`${API_URL}survey/types/getAll`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  getAmountOfSurveys(amount: number) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .get(`${API_URL}survey/getAmountOfSurveys/${amount}`)
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

  changeQuicks(quicks: any[]) {
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user) => {
        this.httpClient
          .patch(`${API_URL}user/changeQuicks/${user.id}`, quicks)
          .subscribe({
            next: (data) => {
              resolve(data);
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    });
  }

  setActivateSurvey(survey: SurveyModel, state: number) {
    this.httpClient
      .patch(
        `${API_URL}survey/activated/setOneActivated/${survey.id}/${state}`,
        {}
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  //------------------------------------------------

  getActiveQuicks() {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${API2_URL}userSurvey/getActiveQuicks/${USER.id}`)
  }

  getActiveQuicksHome() {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${API2_URL}userSurvey/getActiveQuicksHome/${USER.id}`)
  }

  getSurveysOfCategory(id: number): Observable<JoinedUserSurveyModel[]> {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${API2_URL}userSurvey/getActiveByCategoryId/${USER.id}/${id}`)
  }

}
