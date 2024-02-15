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
import { RegisterModel, RegisterModelKeyCloak, UserLoginModel } from 'src/app/models/user.model';

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
  }

  ngOnInit() { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  login() {
    const self = this;

    this.authService.login(this.loginForm.value as UserLoginModel).subscribe({
      next(data) {
        sessionStorage.setItem('jwt-token', data.access_token)
        self.router.navigate([''])
      },
      async error(error) {
        const toast = await self.toastController.create({
          message: error.error.error_description,
          duration: 3000,
        });
        toast.present()
      }
    })
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

    this.authService.registerKeyCloak(this.regform.value as RegisterModelKeyCloak).subscribe({
      async next(data) {
        const toast = await self.toastController.create({
          message: 'User successfully created, please log in',
          duration: 3000,
        });
        toast.present()
        self.loginPage = !self.loginPage
      },
      async error(error) {
        const toast = await self.toastController.create({
          message: error.error.errorMessage,
          duration: 3000,
        });
        toast.present()
      }
    })
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
