import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {API_URL, SERVER_URL_NEU, USER_ID} from '../constants';
import {SurveyModel} from '../models/survey.model';
import { UserSurveyModel } from "../models/userSurvey.model";

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

  updateSurvey(surveyId: string, survey: SurveyModel) {
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

  getUserSurveysOfCategory(id: any)  {
      return this.httpClient
          .get<[SurveyModel, any][]>(`${SERVER_URL_NEU}userSurvey/getAllActivatedByUserAndCategory/${id}/${USER_ID}`)
  }



  getSurveysByName(surveys: [SurveyModel, any][], search: string): [SurveyModel, any][] {
    let selectedSurveys = [];
    for (const survey of surveys) {
      if (survey[0].title.toLowerCase().includes(search.toLowerCase())) {
        selectedSurveys.push(survey);
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

  deleteSurvey(surveyId: string): Promise<any> {
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

  updateUserSurvey(surveyId: string, value: number, unit: string) {
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

  addValueToUserSurvey(surveyId: string, value: number) {
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

  getMeasurements() {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(`${API_URL}survey/measurements/getAll`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
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
    //TODO
    console.log(quicks)
  }

  getQuicks() {
    return this.httpClient.get<UserSurveyModel[]>(SERVER_URL_NEU + "userSurvey/getJoinedUserSurveyByUserID/" +USER_ID);
  }

  getSurveyWithQuicks() {
    return this.httpClient.get<[SurveyModel, boolean][]>(SERVER_URL_NEU + "userSurvey/getAllActivatedJoinedByUserID/" +USER_ID);
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
}
