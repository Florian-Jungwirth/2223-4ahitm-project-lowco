import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usermanagment',
  templateUrl: './usermanagment.page.html',
  styleUrls: ['./usermanagment.page.scss'],
})
export class UsermanagmentPage implements OnInit {
  constructor(private categoryService: UserService, private titleService: TitleService) { }

  ionViewWillEnter() {
    this.titleService.setTitle('Benutzer')
  }

  setUsers: any[] = new Array();
  allUsers: any[] = new Array();

  async ngOnInit() {
    this.setUsers = await this.categoryService.getAllUsers();
    this.allUsers = this.setUsers;
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();
    this.setUsers = await this.categoryService.getUserByEmail(this.allUsers, searched);
  }

  editUser(user: any) {

  }

  deleteUser(user: any) {

  }

}
