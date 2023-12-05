import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnimationController, IonModal, NavController } from '@ionic/angular';
import { ModalService } from '../services/modal.service';
import { TitleService } from '../services/title.service';
import { SurveyService } from '../services/survey.service';
import { Coordinate } from '../models/coordinate.model';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { CategoryService } from '../services/category.service';
import { SurveyModel } from '../models/survey.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage {
  isModalOpen = false;
  isLocationModalOpen = false;
  unitBefore: any;
  valueBefore: any
  obj: any;
  @ViewChild('modal') modal: IonModal;
  units: any;
  title = "";
  locomotionSurveys: SurveyModel[] = []
  locomotionValue: number = 0
  reload = false

  constructor(
    private animationCtrl: AnimationController,
    private modalService: ModalService,
    private router: Router,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    private titleService: TitleService,
    private categoryService: CategoryService
  ) {
    this.modalService.modalState.subscribe((obj) => {
      this.isModalOpen = true;
      this.obj = obj;
      if(this.obj.value != null){
        if(this.obj.value % 1 !== 0){
          this.obj.value = this.obj.value.toFixed(2).replace('.', ',');
        }
        else{
          this.obj.value = this.obj.value.toFixed(0).replace('.', ',');
        }
      }
      else{
        this.obj.value = '';
      }
      //this.obj.value = this.obj.value != null ? this.obj.value.toFixed(2).replace('.', ',') : '';
      this.units = Object.keys(obj.relevantMeasures);
      this.unitBefore = obj.unit
      this.valueBefore = obj.value
      // this.showNum = obj.value
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = this.router.url !== '/lowco';
      }
    });

    this.titleService.title.subscribe((data: string) => {
      this.title = data;
    })

    LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
      if (payload.notification.id == 1 && payload.actionId == 'tap') {
        this.getSurveysOfFortbewegung();
        this.isLocationModalOpen = true;
        this.locomotionValue = payload.notification.extra
      }
      console.log(JSON.stringify(payload));
    })

    this.getSurveysOfFortbewegung()
  }

  getSurveysOfFortbewegung(){
    this.categoryService.getFortbewegung().subscribe(async (element)=> {
      this.locomotionSurveys = await this.surveyService.getSurveysOfCategory(element._id)
    })
  }

  saveLocationModalValue(id: string) {
    console.log(id + ' ' + this.locomotionValue);
    if (this.locomotionValue != 0) {
      this.reload = true;
      this.surveyService.addValueToUserSurvey(id, this.locomotionValue * 1000).then(() => {
        this.reload = false;
      })
    }
    this.isLocationModalOpen = false;
  }

  templateNotification() {
    let distance = 3;
    setTimeout(()=> {
      sendNotification(`Fahrt wurde beendet (${distance.toFixed(2).replace('.', ',')}km)`, 'Klicken, um Fortbewegungsmittel auszuwählen.', distance)
    }, 5000)
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    if (root != null) {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);
      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    } else {
      return null;

    }
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    let ret = this.enterAnimation(baseEl);
    if (ret != null) {
      return ret.direction('reverse');
    }
    return null;
  };

  okModal() {

    if (this.valueBefore != this.obj.value || this.obj.unit != this.unitBefore) {
      this.surveyService.updateUserSurvey(
        this.obj.id,
        this.obj.value * this.obj.relevantMeasures[this.obj.unit],
        this.obj.unit
      );
      this.modalService.updateValue(this.obj.id, this.obj.value, this.obj.unit);
    }
    this.isModalOpen = false;
  }

  showBackButton: boolean = false;

  goBack() {
    // this.location.back();
    this.navCtrl.back();
  }

  changeInput(e: any) {
    this.obj.unit = e.target.value
    //   if(this.selectedBefore == null) {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.obj.unit]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   } else {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.selectedBefore]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   }

    //   this.selectedBefore = e.target.value
  }
}

function getDistanceBetweenTwoPoints(previousCoord: Coordinate, currentCoord: Coordinate) {
  if (previousCoord.lat == currentCoord.lat && previousCoord.lon == currentCoord.lon || previousCoord.lat == -1) {
    return 0;
  }

  const radlat1 = (Math.PI * previousCoord.lat) / 180;
  const radlat2 = (Math.PI * currentCoord.lat) / 180;

  const theta = previousCoord.lon - currentCoord.lon;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}

async function sendNotification(title: string, body: string, distance: number) {
  let options: ScheduleOptions = {
    notifications: [
      {
        title,
        body,
        extra: distance,
        id: 1
      }
    ]
  }

  await LocalNotifications.schedule(options)
}
