import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(
    private titleService: TitleService,
    private authservice: AuthService
  ) {
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Profil');
  }
}
