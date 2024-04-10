import {Component, Input} from '@angular/core';
import {SurveyService} from 'src/app/services/survey.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
})
export class QuantityComponent {
  @Input() title: any;
  @Input() icon: any;
  @Input() showWarning: Boolean = false;
  @Input() value: any;
  @Input() time: number;
  @Input() id: number;
  @Input() period: number;
  @Input() standardValue: number;
  showModal = false
  timeLeft = 0
  hoursLeft = false

  isClickable = 'changeQuantity';

  constructor(private surveyService: SurveyService) {

  }

  ngOnInit() {
    if(!this.value) {
      this.value = this.standardValue
    }

    if (this.value == 0) this.isClickable = 'notClickable';

    this.timeLeft = this.period - (Math.floor(this.time/24) % this.period)-1
    if(this.timeLeft == 0) {
      this.timeLeft = 24 - Math.floor(this.time)%24
      this.hoursLeft = true;
    }
  }

  addOne() {
    this.value += 1;
    this.isClickable = 'changeQuantity';
    this.surveyService.updateUserSurvey(this.id, this.value)
  }

  removeOne() {
    if (this.value > 0) {
      this.value -= 1;

      if (this.value == 0) {
        this.isClickable = 'notClickable';
      }
      this.surveyService.updateUserSurvey(this.id, this.value)
    }
  }

  openModal() {
    this.showModal = true
  }

  changeValues(values: { id: number, value: number, unit: string }) {
    this.id = values.id;
    this.value = values.value;
  }

  closeModal() {
    this.showModal = false
  }
}
