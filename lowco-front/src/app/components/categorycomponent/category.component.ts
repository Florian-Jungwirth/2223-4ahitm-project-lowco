import {Component, Input} from '@angular/core';
import {SurveyModel} from "../../models/survey.model";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-categoryComponent',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  @Input() id: number;
  @Input() icon: String;
  @Input() title: any;
  @Input() showWarning: Boolean;
  @Input() surveys: SurveyModel[] = [];
  @Input() searchString: string

  constructor(private navController: NavController) {
    this.showWarning = false;
    this.icon = "";
  }

  ngOnInit() {
  }


  navigateToSearch(event: Event) {
    event.stopPropagation();
    this.navController.navigateForward(`/lowco/category?id=${this.id}&s=${this.searchString}`);
  }

  navigateTo() {
    this.navController.navigateForward('/lowco/category?id=' + this.id);
  }
}
