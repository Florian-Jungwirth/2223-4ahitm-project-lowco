import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SurveyService } from "../../services/survey.service";
import { IonModal } from "@ionic/angular";

@Component({
  selector: 'app-survey-modal',
  templateUrl: './survey-modal.component.html',
  styleUrls: ['./survey-modal.component.scss'],
})
export class SurveyModalComponent {
  @ViewChild('modal') modal: IonModal;
  @Input() id: number
  @Input() title: string
  @Input() value: number | null
  @Input() unit: string
  @Input() relevantMeasures: any
  @Input() isQuantity: boolean;
  units: any
  unitBefore: string;
  valueBefore: number;
  @Output() valuesChanged = new EventEmitter<{ id: number, value: number, unit: string }>
  @Output() closeModalEmitter = new EventEmitter<void>()

  constructor(private surveyService: SurveyService) {
  }

  ngOnInit() {
    this.value = (this.value == null) ? 0 : this.value
    this.valueBefore = this.value

    if (!this.isQuantity) {
      this.units = Object.keys(this.relevantMeasures);
      this.unitBefore = this.unit
    }
  }

  async okModal() {

    if (this.value != null && this.unit != null) {


      if (!(this.valueBefore == this.value && this.unit == this.unitBefore)) {

        if (!this.isQuantity) {
          this.surveyService.updateUserSurvey(
            this.id,
            this.value * this.relevantMeasures[this.unit],
            this.unit
          ).subscribe()
        } else {
          this.surveyService.updateUserSurvey(
            this.id,
            this.value,
            ''
          ).subscribe()
        }
      }

      this.valuesChanged.emit({ id: this.id, value: this.value, unit: this.unit })
    }
    await this.modal.dismiss()
  }

  changeInput(e: any) {
    this.unit = e.target.value
    //   if(this.selectedBefore == null) {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.obj.unit]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   } else {
    //     this.obj.value = this.obj.value*this.obj.relevantMeasures[this.selectedBefore]
    //     this.obj.value = this.obj.value/this.obj.relevantMeasures[e.target.value]
    //   }

    //   this.selectedBefore = e.target.value
  }

  closeModal() {
    this.closeModalEmitter.emit()
  }
}
