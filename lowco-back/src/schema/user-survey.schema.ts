import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Survey } from './survey.schema';
import { User } from './user.schema';


@Schema()
export class UserSurvey {
  @Prop({ required: true })
  value: number;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true })
  survey: Survey;
}

export type UserSurveyDocument = UserSurvey & Document;
export const UserSurveySchema = SchemaFactory.createForClass(UserSurvey);
