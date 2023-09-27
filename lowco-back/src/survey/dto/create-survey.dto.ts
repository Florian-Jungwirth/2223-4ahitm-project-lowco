import { Category } from "src/schema/category.schema";
import { Measurements, Types } from "src/schema/survey.schema";

export class CreateSurveyDto {
    iconName: string;
    title: string;
    measurement: string;
    standardValue: number;
    type: Types;
    category: Category;
    activated: number;
}
