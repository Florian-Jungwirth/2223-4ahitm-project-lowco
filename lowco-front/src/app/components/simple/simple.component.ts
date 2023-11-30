import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {SurveyService} from 'src/app/services/survey.service';
import {MEASUREMENTS} from "../../constants";

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent {
  @Input() title: any;
  @Input() icon: any;
  @Input() showWarning: boolean;
  @Input() unit: any;
  @Input() value: any;
  @Input() id: any;
  @Input() measurement: any;
  @Input() daysLeft: number;
  measurements: any = MEASUREMENTS;
  relevantMeasures: any;
  showModal = false


  constructor(
    private surveyService: SurveyService,
    private authService: AuthService
  ) {
    this.showWarning = false;
  }

  ngOnInit() {
      if (this.value != undefined) {
        this.value = this.value / this.getMeasurement();
      }
  }

  openModal() {
    this.value = this.value == null ? 0 : this.value
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }

  changeValues(values: { id: string, value: number, unit: string }) {
    this.id = values.id;
    this.value = values.value;
    this.unit = values.unit;
  }

  getMeasurement() {
    // for (let key in this.measurements) {
    //   if (this.measurements[key].name === this.measurement) {
    //     if (this.measurement == 'd') {
    //       const user = await this.authService.getUser();
    //
    //       if (user.metrisch) {
    //         if (this.unit == null || !Object.keys(this.measurements[key].units['metrisch']).includes(this.unit)) {
    //           // this.unit = 'm';
    //           if (this.unit == 'mi') {
    //             this.unit = 'km'
    //           } else {
    //             this.unit = 'm'
    //           }
    //
    //         }
    //
    //         this.relevantMeasures = this.measurements[key].units['metrisch'];
    //         return Promise.resolve(
    //           this.measurements[key].units['metrisch'][this.unit]
    //         );
    //       } else {
    //         if (this.unit == null || !Object.keys(this.measurements[key].units['imperial']).includes(this.unit)) {
    //           // this.unit = 'ft';
    //
    //           if (this.unit == 'm') {
    //             this.unit = 'ft'
    //           } else {
    //             this.unit = 'mi'
    //           }
    //         }
    //
    //         this.relevantMeasures = this.measurements[key].units['imperial'];
    //         return Promise.resolve(
    //           this.measurements[key].units['imperial'][this.unit]
    //         );
    //       }
    //     } else if (this.measurement == 'z') {
    //       if (this.unit == null) {
    //         this.unit = 'min';
    //       }
    //       this.relevantMeasures = this.measurements[key].units
    //       return this.measurements[key].units[this.unit];
    //     }
    //   }
    // }
    // TODO
    return 1;
  }
}
