import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-categoryComponent',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  @Input() icon: String;
  @Input() title: any;
  @Input() showWarning: Boolean;

  constructor() {
    this.showWarning = false;
    this.icon = "";
   }

  ngOnInit() {}

}
