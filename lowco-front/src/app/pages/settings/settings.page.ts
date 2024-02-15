import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private titleService: TitleService) {
  }

  ngOnInit() {
    this.isAdmin = this.authService.isUserAdmin();
    this.userService.getUserByID(this.authService.getUserKeyCloak().sub).subscribe(user => {
      this.user = user;
      this.metric = user.metric;
    })
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Settings')
  }

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  changeInput(event: any) {
    this.user.metric = event.detail.value

    this.userService.updateMetric(this.user).subscribe()
  }
}
