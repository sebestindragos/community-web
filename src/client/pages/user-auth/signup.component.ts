import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersApiService } from '../../core/users/usersAPI.service';

/**
 * Component used for displaying the signup page.
 */
@Component({
  moduleId: module.id,
  templateUrl: 'signup.component.html'
})
export class SignupPageComponent implements OnInit {
  public form: FormGroup;
  public resultMessage = '';
  public resultIsError = false;

  /**
   * Class constructor.
   */
  constructor (
    private _usersApi: UsersApiService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: [null, Validators.compose([
        Validators.required, Validators.email
      ])],
      password: [null, Validators.compose([
        Validators.required, Validators.minLength(6)
      ])],
      firstname: [null, Validators.compose([
        Validators.required
      ])],
      lastname: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Register new account.
   */
  async register () {
    try {
      if (!this.form.valid) return;
      await this._usersApi.create(this.form.value).toPromise();
      this.resultIsError = false;
      this.resultMessage =
        'You have registered your account. Check your email for further instructions on how to activate it.';
    } catch (error) {
      this.resultIsError = true;
      this.resultMessage = error.payload.message;
    }
  }
}
