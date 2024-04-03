import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
    private authService: AuthService,
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

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  goBack() {
    // this.location.back();
    this.navCtrl.back();
  }
}
