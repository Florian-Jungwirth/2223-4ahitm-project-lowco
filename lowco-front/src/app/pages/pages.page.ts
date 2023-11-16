import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnimationController, IonModal, NavController } from '@ionic/angular';
import { ModalService } from '../services/modal.service';
import { TitleService } from '../services/title.service';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage {
  isModalOpen = false;
  unitBefore: any;
  valueBefore: any
  obj: any;
  @ViewChild('modal') modal: IonModal;
  units: any;
  title = "";
  // selectedBefore = null;
  //showNum = 0;

  constructor(
    private animationCtrl: AnimationController,
    private modalService: ModalService,
    private router: Router,
    // private location: Location,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    private titleService: TitleService
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
    
    if(this.valueBefore != this.obj.value || this.obj.unit != this.unitBefore) {
      this.surveyService.updateUserSurvey(
        this.obj.id,
        this.obj.value*this.obj.relevantMeasures[this.obj.unit],
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

  dismiss() {
    this.isModalOpen = false;
  }
}
