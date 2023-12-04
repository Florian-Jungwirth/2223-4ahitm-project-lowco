import {SurveyModel} from "./survey.model";
import {UserModel} from "./user.model";

export interface UserSurveyModel {
  id: number;
  isAQuick: boolean;
  value: number;
  survey: SurveyModel
  time: Date;
  user: UserModel;
  unit: string;
}

export interface UpdateUserSurveyModel {
  id: number | null;
  isAQuick: boolean | null;
  value: number | null;
  unit: number | null;
  userID: number;
  surveyID: number;
}

export interface JoinedUserSurveyModel {
  id: number;
  value: number;
  unit: string;
  isAQuick: boolean;
  survey: SurveyModel
}
