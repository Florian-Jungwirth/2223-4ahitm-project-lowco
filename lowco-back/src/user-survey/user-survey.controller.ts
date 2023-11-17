import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSurveyService } from './user-survey.service';
import { CreateUserSurveyDto } from './dto/create-user-survey.dto';

@Controller('user-survey')
export class UserSurveyController {
  constructor(private readonly userSurveyService: UserSurveyService) {}

  @Post()
  create(@Body() createUserSurveyDto: CreateUserSurveyDto) {
    return this.userSurveyService.create(createUserSurveyDto.value, createUserSurveyDto.user, createUserSurveyDto.survey);
  }

  @Get()
  findAll() {
    return this.userSurveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSurveyService.findOne(id);
  }

  @Get('getByUserAndSurvey/:userId')
  findOneByUser(@Param('userId') userId: string) {
    return this.userSurveyService.findByUser(userId);
  }

  @Patch('addValue/:userId/:surveyId/:value')
  addValue(@Param('userId') userId: string, @Param('surveyId') surveyId: string, @Param('value') value: number) {
    return this.userSurveyService.addValue(userId, surveyId, value);
  }

  @Patch(':userId/:surveyId/:value/:unit')
  update(@Param('userId') userId: string, @Param('surveyId') surveyId: string, @Param('value') value: number, @Param('unit') unit: string) {
    return this.userSurveyService.update(userId, surveyId, value, unit);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSurveyService.remove(id);
  }
}