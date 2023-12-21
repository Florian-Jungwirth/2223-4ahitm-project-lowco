import { Component, OnInit } from '@angular/core';
import {TitleService} from "../../services/title.service";

@Component({
  selector: 'app-fahrtenverlauf',
  templateUrl: './fahrtenverlauf.page.html',
  styleUrls: ['./fahrtenverlauf.page.scss'],
})
export class FahrtenverlaufPage implements OnInit {

  constructor(private titleService: TitleService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Fahrtenverlauf');
  }

}
