import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSurveyDocument } from 'src/schema/user-survey.schema';
import { UserSurvey } from './entities/user-survey.entity';

@Injectable()
export class UserSurveyService {
  constructor(
    @InjectModel(UserSurvey.name)
    private readonly userSurveyModel: Model<UserSurveyDocument>,
  ) {}

  async create(
    value: number,
    user: string,
    survey: string
  ): Promise<UserSurveyDocument> {
    let time = Date.now();
    const newUserSurvey = new this.userSurveyModel({
      value,
      user,
      time,
      survey
    });
    return newUserSurvey.save();
  }

  findAll() {
    return this.userSurveyModel.find().populate('survey');
  }

  findOne(id: string) {
    return this.userSurveyModel.findOne({ _id: id }).populate('survey');
  }
  
  findByUser(userId: string) {
    return this.userSurveyModel.find({user: userId}).populate('survey');
  }

  update(userId: string, surveyId: string, value: number, unit: string) {
    return this.userSurveyModel.findOneAndUpdate({ user: userId, survey: surveyId }, { $set: { value: value, time: Date.now(), unit: unit } },
    { upsert: true, returnOriginal: false })
  }

  remove(id: string) {
    return this.userSurveyModel.deleteOne({ _id: id });
  }
}