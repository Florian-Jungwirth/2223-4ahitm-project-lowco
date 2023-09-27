import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from 'src/app/services/survey.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-survey-selection',
  templateUrl: './survey-selection.page.html',
  styleUrls: ['./survey-selection.page.scss'],
})
export class CategoryPage implements OnInit {
  id: string = '';
  surveys: any;
  selectedSurveys: any;
  values: any;
  types: any;
  loading = true

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private titleService: TitleService
  ) {
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Emissionswerte')
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    Promise.all([
      this.getSurveys(),
      this.getAllVaues(),
      this.surveyService.getTypes()
    ]).then(([surveys, values, types]) => {
      this.surveys = surveys      
      this.values = values
      this.types = types

      this.loading = false
      this.selectedSurveys = this.surveys;
    })
    
  }

  async getSurveys(): Promise<any> {
    return await this.surveyService.getSurveysOfCategory(this.id);
  }

  async getAllVaues(): Promise<any> {
    return await this.surveyService.getAllValuesByUser();
  }

  getValueById(survey: any) {
    for (const value of this.values) {
      if (survey._id == value.survey._id) {      
        return value.value;
      }
    }
    return survey.standardValue;
  }

  getUnitById(survey: any) {
    for (const value of this.values) {
      if (survey._id == value.survey._id) {
        return value.unit;
      }
    }
    return null;
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedSurveys = await this.surveyService.getSurveysByName(
      this.surveys,
      searched
    );
  }
}
