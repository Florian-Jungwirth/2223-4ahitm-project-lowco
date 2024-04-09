import { CategoryModel } from "./category.model";

export interface SurveyModel {
    id: number;
    iconName: string;
    title: string;
    measurement: string;
    standardValue: number;
    type: string;
    category: CategoryModel;
    activated: boolean;
    period: number
}
