import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from 'src/app/services/survey.service';
import { TitleService } from 'src/app/services/title.service';
import {UserSurveyModel} from "../../models/userSurvey.model";
import {Types} from "../../constants";
import {SurveyModel} from "../../models/survey.model";

@Component({
  selector: 'app-survey-selection',
  templateUrl: './survey-selection.page.html',
  styleUrls: ['./survey-selection.page.scss'],
})
export class CategoryPage implements OnInit {
  id: string = '';
  surveys: [SurveyModel, any][];
  selectedSurveys: [SurveyModel, any][];
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

    this.surveyService.getUserSurveysOfCategory(this.id).subscribe(surveys => {
      for (const survey of surveys) {
        if(survey[1] == null) {
          survey[1] = {value: survey[0].standardValue, unit: null}
        }
      }
      this.surveys = surveys;
      this.selectedSurveys = surveys;
      this.loading = false;
      this.types = Types;
    })
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedSurveys = await this.surveyService.getSurveysByName(
      this.surveys,
      searched
    );
  }
}
