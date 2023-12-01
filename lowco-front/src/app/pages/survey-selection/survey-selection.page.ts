import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from 'src/app/services/survey.service';
import { TitleService } from 'src/app/services/title.service';
import {Types} from "../../constants";
import {JoinedUserSurveyModel} from "../../models/userSurvey.model";

@Component({
  selector: 'app-survey-selection',
  templateUrl: './survey-selection.page.html',
  styleUrls: ['./survey-selection.page.scss'],
})
export class CategoryPage implements OnInit {
  id: number = 0
  userSurveys: JoinedUserSurveyModel[];
  selectedUserSurveys: JoinedUserSurveyModel[];
  values: any;
  types = Types;
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

    this.surveyService.getSurveysOfCategory(this.id).subscribe((userSurveys) => {
      console.log(userSurveys)
      this.userSurveys = userSurveys;
      this.selectedUserSurveys = userSurveys;
      this.loading = false;
    })
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedUserSurveys = await this.surveyService.getSurveysByName(
      this.userSurveys,
      searched
    );
  }
}
