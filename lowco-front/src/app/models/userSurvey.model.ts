import {SurveyModel} from "./survey.model";
import {UserModel} from "./user.model";

export interface UserSurveyModel {
  id: number;
  isaquick: boolean;
  value: number;
  survey: SurveyModel
  time: Date;
  user: UserModel;
  unit: string;
  style?: string;
}
