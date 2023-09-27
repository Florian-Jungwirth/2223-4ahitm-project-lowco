import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/schema/survey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Survey.name,
        schema: SurveySchema
      }
    ])
  ],
  providers: [SurveyService],
  controllers: [SurveyController]
})
export class SurveyModule {}
