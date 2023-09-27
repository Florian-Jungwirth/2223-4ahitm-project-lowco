import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
})
export class QuantityComponent {
  @Input() title: any;
  @Input() icon: any;
  @Input() showWarning: Boolean;
  @Input() value: any;
  @Input() id: any;
  @Input() daysLeft: number;

  isClickable = 'changeQuantity';

  constructor(private modalService: ModalService, private surveyService: SurveyService) {
    this.showWarning = false;
    
    if (this.value == 0) this.isClickable = 'notClickable';
    this.modalService.valueChanged.subscribe((changeObj) => {
      if (this.id == changeObj.id) this.value = changeObj.value;
      if (this.value == 0) this.isClickable = 'notClickable';
    });
  }

  addOne() {
    this.value += 1;
    this.isClickable = 'changeQuantity';
    this.surveyService.updateUserSurvey(this.id, this.value, '-')
  }

  removeOne() {
    if (this.value > 0) {
      this.value -= 1;

      if (this.value == 0) {
        this.isClickable = 'notClickable';
      }
      this.surveyService.updateUserSurvey(this.id, this.value, '-')
    }
  }
  openModal() {
    this.modalService.openModalQuantity(this.title, this.value, this.id);
  }
}
