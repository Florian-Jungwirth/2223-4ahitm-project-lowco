import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent {
  @Input() titleIcon: String;
  @Input() title: any;
  @Input() current: any;
  @Input() target: any;
  @Input() progress: any;
  @Input() showWarning: Boolean;
  @Input() id: any;

  constructor() {
    this.showWarning = false;
    this.titleIcon = "";
  }
}