import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileModel } from './profile.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    private titleService: TitleService,
    private authservice: AuthService
  ) {}
  @ViewChild('modal') modal!: IonModal;
  @ViewChild('modal2') modal2!: IonModal;
  @ViewChild('modal3') modal3!: IonModal;

  returnValue: ProfileModel;

  changeNameForm = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    //@ts-ignore
    emailRepeat: new FormControl('', [
      Validators.required,
      Validators.email,
      emailValidator,
    ]),
  });

  changePWForm = new FormGroup({
    pw: new FormControl('', [Validators.required, Validators.minLength(8)]),
    //@ts-ignore
    pwRepeat: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      passValidator,
    ]),
  });

  ionViewWillEnter() {
    this.titleService.setTitle('Profil');
  }

  showNameChange(value: boolean) {
    if (value == true) {
      this.modal.present();

      this.changeNameForm.setValue({
        firstname: this.returnValue.firstname,
        lastname: this.returnValue.lastname,
      });
    } else if (value == false) {
      this.modal.dismiss();
    }
  }

  showEmailChange(value: boolean) {
    if (value == true) {
      this.modal2.present();
    } else if (value == false) {
      this.modal2.dismiss();

      this.changeEmailForm.setValue({
        email: '',
        emailRepeat: '',
      });
    }
  }

  showPWChange(value: boolean) {
    if (value == true) {
      this.modal3.present();
    } else if (value == false) {
      this.modal3.dismiss();

      this.changePWForm.setValue({
        pw: '',
        pwRepeat: '',
      });
    }
  }

  async ngOnInit() {
    this.returnValue = await this.authservice.getUserProfile();
  }

  async editName() {
    let values = this.changeNameForm.value;
    let firstname = values.firstname;
    let lastname = values.lastname;

    if (firstname == undefined || lastname == undefined) {
      firstname = this.returnValue.firstname;
      lastname = this.returnValue.lastname;
    }

    this.authservice.updateName(this.returnValue.id, firstname, lastname);
    this.modal.dismiss();
    window.location.reload();
  }

  async editEmail() {
    let values = this.changeEmailForm.value;
    let email = values.email;

    if (email == undefined) {
      email = this.returnValue.email;
    }

    this.authservice.updateUserEmail(this.returnValue.id, email);
    this.modal2.dismiss();

    this.changeEmailForm.setValue({
      email: '',
      emailRepeat: '',
    });
    window.location.reload();
  }

  async editPW() {
    let values = this.changePWForm.value;
    let pw = values.pw;

    //@ts-ignore
    this.authservice.updateUserPassword(this.returnValue.id, pw);
    this.modal3.dismiss();

    this.changePWForm.setValue({
      pw: '',
      pwRepeat: '',
    });
    window.location.reload();
  }
}

function passValidator(control: FormControl) {
  if (control != undefined) {
    if (
      control.parent?.value.pw != control.value &&
      control.parent?.value.pw != ''
    ) {
      return { passValid: true };
    }
    return null;
  }
  return { passValid: true };
}

function emailValidator(control: FormControl) {
  if (control != undefined) {
    if (
      control.parent?.value.email != control.value &&
      control.parent?.value.email != ''
    ) {
      return { emailValid: true };
    }
    return null;
  }
  return { emailValid: true };
}
