import { Module } from '@nestjs/common';
import { UserSurveyService } from './user-survey.service';
import { UserSurveyController } from './user-survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSurvey, UserSurveySchema } from 'src/schema/user-survey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSurvey.name,
        schema: UserSurveySchema
      }
    ])
  ],
  controllers: [UserSurveyController],
  providers: [UserSurveyService]
})
export class UserSurveyModule {}
