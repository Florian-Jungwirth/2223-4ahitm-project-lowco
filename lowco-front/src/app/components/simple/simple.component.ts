import {Component, Input} from '@angular/core';
import {SurveyService} from 'src/app/services/survey.service';
import { CategoryModel } from 'src/app/models/category.model';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent {
  @Input() title: any;
  @Input() icon: any;
  @Input() showWarning: boolean = false;
  @Input() unit: any;
  @Input() value: any;
  @Input() id: number;
  @Input() category: CategoryModel;
  @Input() measurement: string;
  @Input() daysLeft: number;
  @Input() standardValue: number;
  relevantMeasures: any;
  showModal = false
  isStarted = false
  currentIcon = "caret-forward-outline"

  constructor(private surveyService: SurveyService) {
  }

  async ngOnInit() {
    if (this.value == null) {
      this.value = this.standardValue
    }
    let measure = await this.surveyService.getMeasurement(this.measurement, this.unit)
    this.value = this.value / measure.divisor;
    this.relevantMeasures = measure.relevantMeasures;
    this.unit = measure.unit
  }

  openModal() {
    this.value = this.value == null ? 0 : this.value
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }

  changeValues(values: { id: number, value: number, unit: string }) {
    this.id = values.id;
    this.value = values.value;
    this.unit = values.unit;
  }

  hasBeenStarted(){
    if(!this.isStarted){
      this.isStarted = true;
      this.currentIcon = "square";
    }
    else if(this.isStarted){
      this.isStarted = false;
      this.currentIcon = "caret-forward-outline";
    }
  }

}
