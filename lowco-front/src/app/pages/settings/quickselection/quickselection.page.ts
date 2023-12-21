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
    })
  }

  search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedSurveys = this.surveyService.getUserSurveysByName(
      this.surveys,
      searched
    );
  }

  addToQuicks(quick: JoinedUserSurveyModel, surveyDiv: any) {
    if (!this.selectedQuicks.includes(quick)) {
      if (this.selectedQuicks.length <= 3) {
        this.selectedQuicks.push(quick)
        if(quick.id) {
          this.surveyService.updateUserSurveyISAQuick(quick.survey.id, quick.value, quick.unit, true)
          this.surveyService.getActiveQuicksHome()
        } else {
          let measure = this.surveyService.getMeasurement(quick.survey.measurement, null);
          this.surveyService.updateUserSurveyISAQuick(quick.survey.id, quick.survey.standardValue, measure.unit, true)
          this.surveyService.getActiveQuicksHome()
        }
        surveyDiv.classList.add('selected')
      } else {
        this.presentToast()
      }
    } else {
      this.selectedQuicks.splice(this.selectedQuicks.indexOf(quick), 1)
      this.surveyService.updateUserSurveyISAQuick(quick.survey.id, quick.value, quick.unit, false)
      surveyDiv.classList.remove('selected')
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
