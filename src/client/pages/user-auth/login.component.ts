import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../../core/users/usersAPI.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../core/users/session.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public resultMessage = '';
  public resultIsError = false;

  /**
   * Class constructor.
   */
  constructor (
    private _usersApi: UsersApiService,
    private _sessionService: SessionService,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: [null, Validators.compose([
        Validators.required, Validators.email
      ])],
      password: [null, Validators.compose([
        Validators.required, Validators.minLength(6)
      ])]
    });
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Login user.
   */
  async login () {
    try {
      if (!this.form.valid) return;
      const result: any = await this._usersApi.authenticate(this.form.value).toPromise();
      const token = result.accessToken;
      this._sessionService.setJwt(token);
      this._router.navigateByUrl('/');
    } catch (error) {
      this.resultIsError = true;
      this.resultMessage = error.payload.message;
    }
  }
}
