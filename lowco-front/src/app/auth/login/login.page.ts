import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginPage = true;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkIfAlreadyLoggedIn();
  }

  async checkIfAlreadyLoggedIn() {
    if (await this.authService.isAuthenticated()) {
      await this.router.navigateByUrl('/lowco');
    }
  }

  ngOnInit() {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  login() {
    const self = this;
    //@ts-ignore
    this.authService.login(this.loginForm.value).subscribe({
      async next(res) {
        if (res.token) {
          await self.router.navigateByUrl("/lowco")
        } else {
          const toast = await self.toastController.create({
            message: 'Falsche Email oder Passwort!',
            duration: 3000,
          });
          await toast.present();
        }
      },
      async error() {
        let toast = await self.toastController.create({
          message: 'Fehler aufgetreten!',
          duration: 3000,
        });
        await toast.present();
      },
    });
  }

  regform = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.email,
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
  });

  register() {
    const self = this;

    this.authService
      //@ts-ignore
      .register(this.regform.value)
      .subscribe({
        async next(res) {
          let toast;

          if (res.id) {
            toast = await self.toastController.create({
              message: 'Benutzer erfolgreich erstellt!',
              duration: 10000,
              buttons: [
                {
                  text: 'Login',
                  role: 'cancel',
                  handler: () => {
                    self.loginPage = !self.loginPage;
                  },
                },
              ],
            });
          } else {
            toast = await self.toastController.create({
              message: 'Benutzer existiert bereits!',
              duration: 3000,
            });
          }

          await toast.present();
        },
        async error() {
          let toast = await self.toastController.create({
            message: 'Fehler aufgetreten!',
            duration: 3000,
          });
          await toast.present();
        },
      });
  }

  clearFieldRegister(fieldName: string): void {
    this.regform.get(fieldName)?.setValue('');
  }

  clearFieldLogin(fieldName: string): void {
    this.loginForm.get(fieldName)?.setValue('');
  }

  showPassReg = false;
  showPassConfirmReg = false;

  showPassRegister(conf = false) {
    conf ? this.showPassConfirmReg = !this.showPassConfirmReg : this.showPassReg = !this.showPassReg
  }

  showPassLog = false;
  showPassLogin() {
    this.showPassLog = !this.showPassLog;
  }
}
