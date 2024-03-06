import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TitleService } from '../services/title.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  title = "";

  constructor(
    // private location: Location,
    private navCtrl: NavController,
    private router: Router,
    private titleServie: TitleService
  ) {
    this.titleServie.title.subscribe(data => {
      this.title = data;
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = this.router.url !== '/admin';
      }
    });
  }

  showBackButton: boolean = false;


  goBack() {
    // this.location.back();
    this.navCtrl.back();
  }
}
