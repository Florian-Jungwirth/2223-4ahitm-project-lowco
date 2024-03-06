import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from 'src/app/services/title.service';
import { PagesPage } from '../pages.page';
import { UserService } from 'src/app/services/user.service';
import { RegisterModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isAdmin = false;
  user: RegisterModel;
  metric: boolean;

  constructor(private router: Router, private userService: UserService, private titleService: TitleService) {
  }

  ngOnInit() {
    this.isAdmin = true
    this.userService.getUserByID('6bb773ee-8071-49c1-afa7-ca51472670dd').subscribe(user => {
      this.user = user;
      this.metric = user.metric;
    })
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Settings')
  }

  changeInput(event: any) {
    this.user.metric = event.detail.value

    this.userService.updateMetric(this.user).subscribe()
  }
}
