import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { API_URL } from '../constants';
import { SurveyModel } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

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

  getSurveysOfCategory(id: any): Promise<any> {
    return new Promise<any>((resolve) => {
      this.authService.getUser().then((user) => {
        this.httpClient
          .get(`${API_URL}survey/getByCategory/${id}/${user.id}`)
          .subscribe({
            next: (data) => {
              resolve(data);
            },
          });
      });
    });
  }

  getSurveysByName(surveys: any, search: string): SurveyModel[] {
    let selectedSurveys = [];
    for (const survey of surveys) {
      if (survey.title.toLowerCase().includes(search.toLowerCase())) {
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

  getQuicks(): any {
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user) => {
        this.httpClient.get(`${API_URL}user/getQuicks/${user.id}`).subscribe({
          next: (data: any) => {
            resolve(data[0].quicks);
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
        `${API_URL}survey/activated/setOneActivated/${survey._id}/${state}`,
        {}
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
