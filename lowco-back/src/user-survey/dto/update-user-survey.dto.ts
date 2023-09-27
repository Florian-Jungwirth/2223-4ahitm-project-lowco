import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSurveyDto } from './create-user-survey.dto';

export class UpdateUserSurveyDto extends PartialType(CreateUserSurveyDto) {
    value: number;
    unit: string;
}
