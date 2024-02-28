import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyModel } from '../../models/survey.model';
import { AlertController, IonModal } from '@ionic/angular';
import { TitleService } from 'src/app/services/title.service';
import { SurveyService } from 'src/app/services/survey.service';
import { CategoryService } from 'src/app/services/category.service';
import {MEASUREMENTS, Types} from "../../constants";
import {CategoryModel} from "../../models/category.model";

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

  setSurveys: SurveyModel[] = [];
  allSurveys: SurveyModel[] = [];
  categories: CategoryModel[] = []
  edit = false;
  surveyId = 0
  collapsed = true;
  measurements = MEASUREMENTS;
  types: any[] = [];
  @ViewChild('modal') modal!: IonModal

  async ngOnInit() {
    this.surveyService.getAllSurveysAdmin().subscribe((surveys: any) => {
      this.setSurveys = surveys
      this.allSurveys = this.setSurveys;
    });

    this.categoryService.getAllCategories().subscribe((categories: any) => {
      this.categories = categories
    });

    this.types = []
    for (let i = 0; i < Object.keys(Types).length; i++) {
      this.types.push({value: Object.values(Types)[i], key: Object.keys(Types)[i]})
    }
  }

  selectedIcon = "";
  selectedCategoryID: number = 0

  surveyForm = new FormGroup({
    surveyTitle: new FormControl('', [Validators.required]),
    surveyMeasurements: new FormControl('', [Validators.required]),
    surveyStandard: new FormControl(0, [Validators.required]),
    surveyType: new FormControl('', [Validators.required])
  });

  async editModal(survey: SurveyModel) {
    this.surveyId = survey.id

    this.surveyForm.setValue({
      surveyTitle: survey.title,
      surveyStandard: survey.standardValue,
      surveyMeasurements: survey.measurement,
      surveyType: survey.type
    })
    this.selectedIcon = survey.iconName;
    this.selectedCategoryID = survey.category.id
    this.edit = true
    await this.modal.present()
  }

  async updateSurvey() {
    let formValues = this.surveyForm.value;
    let selectedCategory: CategoryModel | null = null
    for (const category of this.categories) {
      if(category.id == this.selectedCategoryID) {
        selectedCategory = category
      }
    }

    for (const survey of this.setSurveys) {
      if (survey.id == this.surveyId && selectedCategory && formValues.surveyTitle && formValues.surveyStandard != null && formValues.surveyMeasurements && formValues.surveyType) {
        survey.title = formValues.surveyTitle
        survey.iconName = this.selectedIcon
        survey.standardValue = formValues.surveyStandard
        survey.measurement = formValues.surveyMeasurements
        survey.type = formValues.surveyType
        survey.category = selectedCategory
        this.surveyService.updateSurvey(survey).subscribe()
        break;
      }
    }

    await this.modal.dismiss();
  }

  async createModal() {
    this.surveyForm.reset()
    this.selectedIcon = ""
    this.edit = false
    await this.modal.present()
  }

  async createSurvey() {
    let formValues = this.surveyForm.value;
    let selectedCategory: CategoryModel | null = null
    for (const category of this.categories) {
      if(category.id == this.selectedCategoryID) {
        selectedCategory = category
      }
    }

    //@ts-ignore
    let createSurvey: SurveyModel = { title: formValues.surveyTitle, iconName: this.selectedIcon, measurement: formValues.surveyMeasurements, standardValue: formValues.surveyStandard, type: formValues.surveyType, category: selectedCategory, activated: true }

    if(createSurvey.type == 'a') {
      createSurvey.measurement = 'a'
    }

    this.surveyService.createNewSurvey(createSurvey).subscribe((data) => {
      this.ngOnInit()
    })
    await this.modal.dismiss();
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
            this.surveyService.deleteSurvey(survey.id).subscribe(() => {
              this.ngOnInit()
            });
          }
        },
      ],
    });

    await alert.present();
  }

  search(event: any) {
    let searched = event.target.value.toLowerCase();
    this.setSurveys = this.surveyService.getSurveysByName(this.allSurveys, searched);
  }

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  async iconSelectionChange(icon: string) {
    this.selectedIcon = icon;
    await this.modal2.dismiss();
  }

  changeCollapsed() {
    this.collapsed = !this.collapsed;
  }

  deactivate(survey: SurveyModel) {
    survey.activated = false
    this.surveyService.updateSurvey(survey).subscribe()
    this.setSurveys[this.setSurveys.indexOf(survey)].activated = false;
  }

  activate(survey: SurveyModel) {
    survey.activated = true
    this.surveyService.updateSurvey(survey).subscribe()
    this.setSurveys[this.setSurveys.indexOf(survey)].activated = true;
  }

  changeCategoryId(e: any) {
    this.selectedCategoryID = e.detail.value;
  }
}
