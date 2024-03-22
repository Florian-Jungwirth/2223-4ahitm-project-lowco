import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SurveyService } from 'src/app/services/survey.service';
import { TitleService } from 'src/app/services/title.service';
import {JoinedUserSurveyModel} from "../../../models/userSurvey.model";

@Component({
  selector: 'app-quickselection',
  templateUrl: './quickselection.page.html',
  styleUrls: ['./quickselection.page.scss'],
})
export class QuickselectionPage implements OnInit {
  surveys: any;
  loading: boolean = true;
  loadingBetween: boolean = false;
  selectedSurveys: JoinedUserSurveyModel[] = []
  selectedQuicks: JoinedUserSurveyModel[] = []

  constructor(private surveyService: SurveyService, private toastController: ToastController, private titleService: TitleService) { }

  ionViewWillEnter() {
    this.titleService.setTitle('Schnellauswahl')
  }

  ngOnInit() {
    this.surveyService.getAllActiveJoined().subscribe((quicks) => {
      this.surveys = quicks;
      this.selectedSurveys = quicks;
      this.selectedQuicks = quicks.filter((i) => {return i.isAQuick})
      this.loading = false;
      this.loadingBetween = false
    })
  }

  search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedSurveys = this.surveyService.getUserSurveysByName(
      this.surveys,
      searched
    );
  }

  async addToQuicks(quick: JoinedUserSurveyModel, surveyDiv: any) {
    if(!this.loadingBetween) {

      this.loadingBetween = true;
      if (!this.selectedQuicks.includes(quick)) {
        if (this.selectedQuicks.length <= 3) {
          if(quick.id) {
            this.surveyService.updateUserSurveyISAQuick(quick.survey.id, quick.value, quick.unit, true).subscribe(() => {
              this.ngOnInit()
            })
          } else {
            let measure = await this.surveyService.getMeasurement(quick.survey.measurement, null);

            this.surveyService.updateUserSurveyISAQuick(
              quick.survey.id,
              quick.survey.standardValue,
              measure.unit === '' ? null : measure.unit, // Check if measure.unit is empty, replace with null if true
              true
            ).subscribe(() => {
              this.ngOnInit()
            });

          }
        } else {
          this.loadingBetween = false;
          await this.presentToast()
        }
      } else {
        this.selectedQuicks.splice(this.selectedQuicks.indexOf(quick), 1)
        this.surveyService.updateUserSurveyISAQuick(quick.survey.id, quick.value, quick.unit, false).subscribe(() => {
          this.ngOnInit()
        })
      }
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Du kannst max. 4 auswählen!',
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
}
