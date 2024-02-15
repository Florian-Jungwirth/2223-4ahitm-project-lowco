import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { API2_URL, API_URL, MEASUREMENTS } from '../constants';
import { SurveyModel } from '../models/survey.model';
import { JoinedUserSurveyModel } from "../models/userSurvey.model";
import {BehaviorSubject, Observable, firstValueFrom} from "rxjs";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  activeQuicksHomeEmitter = new BehaviorSubject<JoinedUserSurveyModel[]>([])

  constructor(private httpClient: HttpClient, private authService: AuthService, private userService: UserService) {
  }

  getAllSurveys(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.httpClient.get(`${ API_URL }survey`).subscribe({
        next: (data) => {
          resolve(data);
        },
      });
    });
  }

  updateSurvey(surveyId: number, survey: SurveyModel) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.patch(`${ API_URL }survey/${ surveyId }`, survey).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }


  getSurveyById(id: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(`${ API_URL }survey/${ id }`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }



  getSurveysByName(surveys: SurveyModel[], search: string): SurveyModel[] {
    let selectedSurveys = [];
    for (const survey of surveys) {
      if (survey.title.toLowerCase().includes(search.toLowerCase())) {
        selectedSurveys.push(survey);
      }
    }
    return selectedSurveys;
  }

  getUserSurveysByName(userSurveys: JoinedUserSurveyModel[], search: string): JoinedUserSurveyModel[] {
    let selectedUserSurveys = [];
    for (const userSurvey of userSurveys) {
      if (userSurvey.survey.title.toLowerCase().includes(search.toLowerCase())) {
        selectedUserSurveys.push(userSurvey);
      }
    }
    return selectedUserSurveys;
  }

  createNewSurvey(survey: SurveyModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(`${ API_URL }survey`, survey).subscribe({
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
      this.httpClient.delete(`${ API_URL }survey/${ surveyId }`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  getAllValuesByUser() {
    /*
    TODO
    return new Promise<any>((resolve, reject) => {
      this.authService.getUser().then((user: any) => {
        this.httpClient
          .get(`${ API_URL }user-survey/getByUserAndSurvey/${ user.id }`)
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
    */
  }

  getAmountOfSurveys(amount: number) {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .get(`${ API_URL }survey/getAmountOfSurveys/${ amount }`)
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

  setActivateSurvey(survey: SurveyModel, state: number) {
    this.httpClient
      .patch(
        `${ API_URL }survey/activated/setOneActivated/${ survey.id }/${ state }`,
        {}
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  //------------------------------------------------

  getActiveQuicks() {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${ API2_URL }userSurvey/getActiveQuicks/${ this.authService.getUserKeyCloak().sub }`)
  }


  getAllSurveysAdmin() {
    return this.httpClient.get(`${ API2_URL }survey/all`)
  }

  getActiveQuicksHome() {
    this.httpClient.get<JoinedUserSurveyModel[]>(`${ API2_URL }userSurvey/getActiveQuicksHome/${ this.authService.getUserKeyCloak().sub }`).subscribe((data) => {
      this.activeQuicksHomeEmitter.next(data)
    })
  }

  getAllActiveJoined() {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${ API2_URL }userSurvey/getJoinedUserSurveysByUser/${this.authService.getUserKeyCloak().sub }`)
  }

  getSurveysOfCategory(id: number): Observable<JoinedUserSurveyModel[]> {
    return this.httpClient.get<JoinedUserSurveyModel[]>(`${ API2_URL }userSurvey/getActiveByCategoryId/${ this.authService.getUserKeyCloak().sub }/${ id }`)
  }

  getAllActiveSurveys(): Observable<SurveyModel[]> {
    return this.httpClient.get<SurveyModel[]>(`${ API2_URL }survey/getAllActiveSurveys`)
  }

  updateUserSurvey(surveyID: number, value: number, unit: string | null = null) {
    this.httpClient.put(`${ API2_URL }userSurvey/updateUserSurvey/${ this.authService.getUserKeyCloak().sub }/${ surveyID }/${ value }/${ unit }`, {}).subscribe();
  }

  updateUserSurveyISAQuick(surveyID: number, value: number, unit: string, isAQuick: boolean) {
    this.httpClient.put(`${ API2_URL }userSurvey/updateQuick/${ this.authService.getUserKeyCloak().sub }/${ surveyID }/${ value }/ ${ unit }/${ isAQuick }`, {}).subscribe();
  }

  addValueToUserSurvey(surveyId: number, value: number) {
    return this.httpClient.patch(
      `${ API2_URL }userSurvey/addValue/${ this.authService.getUserKeyCloak().sub }/${ surveyId }/${ value }`, {})
  }

  async getMeasurement(measurementGiven: string, unit: any): Promise<{ divisor: number; relevantMeasures: any; unit: string; }> {
    let measurements: any = MEASUREMENTS;

    for (const measurement of measurements) {
      if (measurement.name == measurementGiven) {
        if (measurementGiven == 'd') {
          
          if ((await firstValueFrom(this.userService.getUserByID(this.authService.getUserKeyCloak().sub))).metric) {
            if (unit == null || !Object.keys(measurement.units.metrisch).includes(unit)) {
              if (unit == 'mi') {
                unit = 'km'
              } else {
                unit = 'm'
              }
            }

            return { divisor: measurement.units.metrisch[unit], relevantMeasures: measurement.units.metrisch, unit: unit };
          } else {
            if (unit == null || !Object.keys(measurement.units.imperial).includes(unit)) {

              if (unit == 'm') {
                unit = 'ft'
              } else {
                unit = 'mi'
              }
            }

            return { divisor: measurement.units.imperial[unit], relevantMeasures: measurement.units.imperial, unit: unit };
          }
        } else if (measurementGiven == 'z') {
          if (unit == null) {
            unit = 'min';
          }

          return { divisor: measurement.units[unit], relevantMeasures: measurement.units, unit: unit };
        }
      }
    }
    return { divisor: 1, relevantMeasures: null, unit: '' };
  }

}
