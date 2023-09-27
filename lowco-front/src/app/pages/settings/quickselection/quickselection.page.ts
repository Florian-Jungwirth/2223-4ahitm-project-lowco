import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { SurveyService } from 'src/app/services/survey.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-quickselection',
  templateUrl: './quickselection.page.html',
  styleUrls: ['./quickselection.page.scss'],
})
export class QuickselectionPage implements OnInit {
  surveys: any;
  selectedSurveys: any;
  types: any;
  loading = true;
  selectedQuicks: any[] = []

  constructor(private surveyService: SurveyService, private toastController: ToastController, private titleService: TitleService) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Schnellauswahl')
  }

  ngOnInit() {
    Promise.all([this.getSurveys(), this.surveyService.getTypes(), this.surveyService.getQuicks()]).then(
      ([surveys, types, quicks]) => {
        for (const survey of surveys) {
          for (const quick of quicks) {
            if(survey._id == quick) {
              survey.selected = true
              break;
            } else {
              survey.selected = false
            }      
          }
        }

        this.surveys = surveys;
        this.types = types;
        this.selectedQuicks = quicks;
        this.loading = false;
        this.selectedSurveys = this.surveys;
      }
    );
  }

  async getSurveys(): Promise<any> {
    return await this.surveyService.getAllActivatedSurveys();
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();

    this.selectedSurveys = await this.surveyService.getSurveysByName(
      this.surveys,
      searched
    );
  }

  addToQuicks(id: any, survey: any) {
    if(!this.selectedQuicks.includes(id)) {
      if(this.selectedQuicks.length <= 3) {
        this.selectedQuicks.push(id)      
        this.surveyService.changeQuicks(this.selectedQuicks)
        survey.classList.add('selected')
      } else {
        this.presentToast()
      }
    } else {
      this.selectedQuicks.splice(this.selectedQuicks.indexOf(id), 1)
      this.surveyService.changeQuicks(this.selectedQuicks)
      survey.classList.remove('selected')
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
