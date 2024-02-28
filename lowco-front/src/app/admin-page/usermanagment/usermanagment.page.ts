import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { UserService } from 'src/app/services/user.service';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-usermanagment',
  templateUrl: './usermanagment.page.html',
  styleUrls: ['./usermanagment.page.scss'],
})
export class UsermanagmentPage implements OnInit {
  constructor(private authService: AuthService, private titleService: TitleService, private userService: UserService) { }

  ionViewWillEnter() {
    this.titleService.setTitle('Benutzer')
  }

  setUsers: any[] = new Array();
  allUsers: any[] = new Array();

  async ngOnInit() {
    //TODO
    //this.setUsers = await this.categoryService.getAllUsers();
    this.authService.getAllDefaultUsersKeycloak().then(promise => {
      promise.subscribe(defaults => {
        this.setUsers = defaults

        this.authService.getAllAdminUsersKeycloak().then(promise2 => {
          promise2.subscribe(admins => {
            for (const admin of admins) {
              for (const default1 of this.setUsers) {
                if(!default1.admin) {
                  default1.admin = false
                }
                if(admin.id == default1.id) {
                  default1.admin = true
                }
              }
            }
            this.allUsers = this.setUsers
          })
        })
      })
    })
  }

  async search(event: any) {
    this.setUsers = this.userService.searchUserByEmail(this.allUsers, event.target.value.toLowerCase())
  }

  editUser(user: any) {

  }

  deleteUser(user: any) {

  }

}
