import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {SurveyService} from 'src/app/services/survey.service';
import {MEASUREMENTS, USER} from "../../constants";

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
  @Input() measurement: any;
  @Input() daysLeft: number;
  @Input() standardValue: number;
  measurements: any = MEASUREMENTS;
  relevantMeasures: any;
  showModal = false

  ngOnInit() {
    if (this.value == null) {
      this.value = this.standardValue
    }
    this.value = this.value / this.getMeasurement();
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

  getMeasurement() {
    for (const measurement of this.measurements) {
      if (measurement.name == this.measurement) {
        if (this.measurement == 'd') {
          if (USER.metric) {
            if (this.unit == null || !Object.keys(measurement.units.metrisch).includes(this.unit)) {
              if (this.unit == 'mi') {
                this.unit = 'km'
              } else {
                this.unit = 'm'
              }
            }

            this.relevantMeasures = measurement.units.metrisch;
            return measurement.units.metrisch[this.unit]
          } else {
            if (this.unit == null || !Object.keys(measurement.units['imperial']).includes(this.unit)) {

              if (this.unit == 'm') {
                this.unit = 'ft'
              } else {
                this.unit = 'mi'
              }
            }

            this.relevantMeasures = measurement.units['imperial'];
            return measurement.units['imperial'][this.unit]
          }
        } else if (this.measurement == 'z') {
          if (this.unit == null) {
            this.unit = 'min';
          }
          this.relevantMeasures = measurement.units
          return measurement.units[this.unit];
        }
      }
    }
    return 1;
  }
}
