import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {SurveyService} from 'src/app/services/survey.service';

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
  measurements: any;
  relevantMeasures: any;
  loaded = false;
  showModal = false


  constructor(
    private surveyService: SurveyService,
    private authService: AuthService
  ) {
    this.showWarning = false;
  }

  ngOnInit() {
    this.surveyService.getMeasurements().then(async data => {
      this.measurements = data
      if (this.value != undefined) {
        this.value = this.value / (await this.getMeasurement());
      }
      this.loaded = true;
    });
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

  async getMeasurement() {

    for (let key in this.measurements) {
      if (this.measurements[key].name === this.measurement) {
        if (this.measurement == 'd') {
          const user = await this.authService.getUser();

          if (user.metrisch) {
            if (this.unit == null || !Object.keys(this.measurements[key].units['metrisch']).includes(this.unit)) {
              // this.unit = 'm';
              if (this.unit == 'mi') {
                this.unit = 'km'
              } else {
                this.unit = 'm'
              }

            }

            this.relevantMeasures = this.measurements[key].units['metrisch'];
            return Promise.resolve(
              this.measurements[key].units['metrisch'][this.unit]
            );
          } else {
            if (this.unit == null || !Object.keys(this.measurements[key].units['imperial']).includes(this.unit)) {
              // this.unit = 'ft';

              if (this.unit == 'm') {
                this.unit = 'ft'
              } else {
                this.unit = 'mi'
              }
            }

            this.relevantMeasures = this.measurements[key].units['imperial'];
            return Promise.resolve(
              this.measurements[key].units['imperial'][this.unit]
            );
          }
        } else if (this.measurement == 'z') {
          if (this.unit == null) {
            this.unit = 'min';
          }
          this.relevantMeasures = this.measurements[key].units
          return this.measurements[key].units[this.unit];
        }
        // this.relevantMeasures = this.measurements[key].units;
        // console.log(Object.keys(this.measurements[key].units));

        // if (Object.keys(this.measurements[key].units).includes(this.unit)) {
        //   return this.measurements[key].units[this.unit];
        // } else {
        //   if (this.measurement == 'z') {
        //     this.unit = 'min';
        //     return this.measurements[key].units['min'];
        //   } else if (this.measurement == 'd') {
        //     this.unit = 'm';
        //     const user = await this.authService.getUser();
        //     if (user.metrisch) {
        //       this.relevantMeasures = this.measurements[key].units['metrisch'];
        //       return Promise.resolve(
        //         this.measurements[key].units['metrisch']['m']
        //       );
        //     } else {
        //       this.relevantMeasures = this.measurements[key].units['imperisch'];
        //       return Promise.resolve(
        //         this.measurements[key].units['imperisch']['m']
        //       );
        //     }
        //   }
        // }
      }
    }
    return 1;
  }
}
