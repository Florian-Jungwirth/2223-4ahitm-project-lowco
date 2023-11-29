import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Capacitor} from "@capacitor/core";
import {initializeApp} from "firebase/app";
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router) {
    this.initializeFirebase();
  }

  public async initializeFirebase(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      return;
    }
    initializeApp(environment.firebase);
  }
}
