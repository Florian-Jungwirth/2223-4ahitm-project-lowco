import { CategoryModel } from "./category.model";

export interface SurveyModel {
    id: string;
    iconName: string;
    title: string;
    measurement: string;
    standardValue: number;
    type: string;
    category: CategoryModel;
}
