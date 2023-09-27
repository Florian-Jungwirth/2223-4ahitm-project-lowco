import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isAdmin = false;
  user: any;
  metric: number;
  first = true;

  constructor(private router: Router, private authService: AuthService, private titleService: TitleService) {
  }

  async ngOnInit() {
    this.isAdmin = await this.authService.isUserAdmin();
    this.user = await this.authService.getUser();
    this.metric = this.user.metrisch;
  }

  ionViewWillEnter() {
    this.titleService.setTitle('Settings')
  }

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  changeInput(event: any) {
    if (!this.first) {
      this.authService.updateMetric(this.user.id, event.target.value);
    }
    this.first = false
  }
}
