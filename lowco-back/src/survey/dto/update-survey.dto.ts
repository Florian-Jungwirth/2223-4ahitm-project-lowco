import { PartialType } from '@nestjs/mapped-types';
import { Category } from 'src/schema/category.schema';
import { CreateSurveyDto } from './create-survey.dto';
import { Types } from 'src/schema/survey.schema';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {
    iconName: string;
    title: string;
    measurement: string;
    standardValue: number;
    type: Types;
    category: Category;
    activated: number;
}
