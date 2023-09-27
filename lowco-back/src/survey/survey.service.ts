import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyDocument } from 'src/schema/survey.schema';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Survey } from './entities/survey.entity';
import { title } from 'process';
//import { ObjectID } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name)
    private readonly surveyModel: Model<SurveyDocument>,
  ) {}

  async create(surveyDto: CreateSurveyDto): Promise<SurveyDocument> {
    const newSurvey = new this.surveyModel(surveyDto);
    return newSurvey.save();
  }

  findAll() {
    return this.surveyModel.find()
  }

  getAmountOfSurveys(amount: number) {
    return this.surveyModel.find().sort({title: 1}).limit(amount)
  }

  findOne(id: string) {
    return this.surveyModel.findOne({ _id: id });
  }

  findByCategoryId(categoryId: string, userId: string) {
    return this.surveyModel.find({ category: categoryId });
    // const categoryIdObjectID = new mongoose.Types.ObjectId(categoryId);
    // const userIdObjectId = new mongoose.Types.ObjectId(userId);
    // return this.surveyModel.aggregate([
    //   {
    //     $lookup: {
    //       from: 'usersurveys',
    //       localField: '_id',
    //       foreignField: 'survey',
    //       as: 'usersurveys',
    //     },
    //   },
    //   {
    //     $match: {
    //       category: categoryIdObjectID,
    //       user: userIdObjectId
    //     },
    //   },
    // ]);
  }

  changeSurvey(id: string, updateSurveyDto: UpdateSurveyDto) {
    return this.surveyModel.updateOne({ _id: id }, updateSurveyDto);
  }

  remove(id: string) {
    return this.surveyModel.deleteOne({ _id: id });
  }

  setAllActivated() {
    return this.surveyModel.updateMany({}, {$set: {activated: 1}});
  }
  
  setOneActivated(id: string, state: number) {
    if(state == 1 || state == 0) {
      return this.surveyModel.updateOne({_id: id}, {$set: {activated: state}})
    } else {
      return new HttpException('Only values 0 or 1 allowed!', HttpStatus.BAD_REQUEST)
    }
  }
  
  getAllActivated() {
    return this.surveyModel.find({activated: 1}).populate({
      path: 'category',
      match: { activated: 1 }
    }).then(data => {
      const activatedSurveys = data.filter((survey) => survey.category);
      activatedSurveys.forEach((survey) => {
        survey.category = undefined;
      });

      return activatedSurveys
    });
  }

  getAllAdmin() {
    return this.surveyModel.find().populate({
      path: 'category',
      match: { activated: 0 }
    })
  }
}
