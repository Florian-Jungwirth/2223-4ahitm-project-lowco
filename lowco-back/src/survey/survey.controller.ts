import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Logger } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Measurements, Types } from 'src/schema/survey.schema';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(id);
  }

  @Get('getByCategory/:categoryId/:userId')
  findByCategoryId(@Param('categoryId') categoryId: string, @Param('userId') userId: string) {
    return this.surveyService.findByCategoryId(categoryId, userId);
  }

  @Patch(':id')
  changeSurvey(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.changeSurvey(id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyService.remove(id);
  }

  @Get('measurements/getAll')
  getMeasuerments() {
    return Measurements;
  }

  @Get('types/getAll')
  getTypes() {
    return Types;
  }

  @Get('getAmountOfSurveys/:amount')
  getAmountOfSurveys(@Param('amount') amount: number) {
    return this.surveyService.getAmountOfSurveys(amount)
  }

  @Get('activated/all')
  getActivated() {
    return this.surveyService.getAllActivated();
  }

  @Get('activated/allAdmin')
  getAllAdmin() {
    return this.surveyService.getAllAdmin();
  }

  @Patch('activated/setOneActivated/:id/:state')
  setOneActivated(@Param('id') id: string, @Param('state') state: number) {
    return this.surveyService.setOneActivated(id, state);
  }
}
