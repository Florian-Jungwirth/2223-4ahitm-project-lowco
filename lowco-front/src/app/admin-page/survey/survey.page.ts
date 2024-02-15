import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyModel } from '../../models/survey.model';
import { AlertController, IonModal } from '@ionic/angular';
import { TitleService } from 'src/app/services/title.service';
import { SurveyService } from 'src/app/services/survey.service';
import { CategoryService } from 'src/app/services/category.service';
import {MEASUREMENTS, Types} from "../../constants";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  constructor(private surveyService: SurveyService, private categoryService: CategoryService, private alertController: AlertController, private titleService: TitleService) { }

  ionViewWillEnter() {
    this.titleService.setTitle('Emissionswerte')
  }

  setSurveys: any[] = new Array();
  allSurveys: any[] = new Array();
  categories: any = []
  edit = false;
  surveyId = 0
  collapsed = true;
  measurements = MEASUREMENTS;
  types: any[] = [];
  @ViewChild('modal') modal!: IonModal

  async ngOnInit() {
    this.surveyService.getAllSurveysAdmin().subscribe((surveys: any) => {
      this.setSurveys = surveys
    });

    this.categoryService.getAllCategories().subscribe((categories: any) => {
      this.categories = categories
    });

    this.allSurveys = this.setSurveys;

    for (let i = 0; i < Object.keys(Types).length; i++) {
      this.types.push({value: Object.values(Types)[i], key: Object.keys(Types)[i]})
    }
  }

  toArray(obj: any): any[] {
    const array = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        array.push({ key: key, value: obj[key] });
      }
    }
    return array;
  }

  selectedIcon = "";

  surveyForm = new FormGroup({
    surveyTitle: new FormControl('', [Validators.required]),
    surveyMeasurements: new FormControl('', [Validators.required]),
    surveyStandard: new FormControl(0, [Validators.required]),
    surveyType: new FormControl('', [Validators.required]),
    surveyCat: new FormControl(0, [Validators.required])
  });

  async editModal(survey: SurveyModel) {
    this.surveyId = survey.id

    this.surveyForm.setValue({
      surveyTitle: survey.title,
      surveyStandard: survey.standardValue,
      surveyMeasurements: survey.measurement,
      surveyType: survey.type,
      surveyCat: survey.category.id
    })
    this.selectedIcon = survey.iconName;
    this.edit = true
    this.modal.present()
  }

  async updateSurvey() {
    let formValues = this.surveyForm.value;
    console.log(formValues);

    //@ts-ignore
    let updatedSurvey: SurveyModel = { title: formValues.surveyTitle, iconName: this.selectedIcon, measurement: formValues.surveyMeasurements, standardValue: formValues.surveyStandard, type: formValues.surveyType, category: formValues.surveyCat }
    this.surveyService.updateSurvey(this.surveyId, updatedSurvey)


    for (const survey of this.setSurveys) {
      if (survey.id == this.surveyId) {
        survey.title = updatedSurvey.title
        survey.iconName = updatedSurvey.iconName
        survey.standardValue = updatedSurvey.standardValue
        survey.measurement = updatedSurvey.measurement
        survey.dataType = updatedSurvey.type
        survey.category.id = updatedSurvey.category
        break;
      }
    }

    this.modal.dismiss();
  }

  async createModal() {
    this.surveyForm.reset()
    this.selectedIcon = ""
    this.edit = false
    this.modal.present()
  }

  async createSurvey() {
    let formValues = this.surveyForm.value;
    //@ts-ignore
    let createSurvey: SurveyModel = { title: formValues.surveyTitle, iconName: this.selectedIcon, measurement: formValues.surveyMeasurements, standardValue: formValues.surveyStandard, type: formValues.surveyType, category: formValues.surveyCat }
    this.surveyService.createNewSurvey(createSurvey).then((survey) => {
      this.setSurveys.push(survey)
    })
    this.modal.dismiss();
  }

  async deleteSurvey(survey: SurveyModel) {
    const alert = await this.alertController.create({
      header: survey.title + ' löschen?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Nein',
          cssClass: 'alert-button-cancel',
          role: 'cancel'
        },
        {
          text: 'Ja',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.surveyService.deleteSurvey(survey.id);
            this.setSurveys.splice(this.setSurveys.indexOf(survey), 1)
          }
        },
      ],
    });

    await alert.present();
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();
    this.setSurveys = await this.surveyService.getSurveysByName(this.allSurveys, searched);
  }

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  iconSelectionChange(icon: string) {
    this.selectedIcon = icon;
    this.modal2.dismiss();
  }

  changeCollapsed() {
    this.collapsed = !this.collapsed;
  }

  deactivate(survey: SurveyModel) {
    this.surveyService.setActivateSurvey(survey, 0);
    this.setSurveys[this.setSurveys.indexOf(survey)].activated = 0;
  }

  activate(survey: SurveyModel) {
    this.surveyService.setActivateSurvey(survey, 1);
    this.setSurveys[this.setSurveys.indexOf(survey)].activated = 1;
  }
}
