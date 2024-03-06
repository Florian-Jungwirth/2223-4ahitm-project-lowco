import { Component, OnInit, ViewChild } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(
    private titleService: TitleService
  ) {
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Profil');
  }
}
