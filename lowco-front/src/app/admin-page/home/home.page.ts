import { Component } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private titleService: TitleService) {

  }

  ionViewWillEnter() {
    this.titleService.setTitle('Administration')
  }
}
