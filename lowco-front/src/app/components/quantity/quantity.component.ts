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
  @Input() id: number;
  @Input() daysLeft: number;
  @Input() standardValue: number;
  showModal = false

  isClickable = 'changeQuantity';

  constructor(private surveyService: SurveyService) {

  }

  ngOnInit() {
    if(!this.value) {
      this.value = this.standardValue
    }

    if (this.value == 0) this.isClickable = 'notClickable';
  }

  addOne() {
    this.value += 1;
    this.isClickable = 'changeQuantity';
    this.surveyService.updateUserSurvey(this.id, this.value).subscribe()
  }

  removeOne() {
    if (this.value > 0) {
      this.value -= 1;

      if (this.value == 0) {
        this.isClickable = 'notClickable';
      }
      this.surveyService.updateUserSurvey(this.id, this.value).subscribe()
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
