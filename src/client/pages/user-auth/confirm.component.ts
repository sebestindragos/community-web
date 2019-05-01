import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersApiService } from '../../core/users/usersAPI.service';

@Component({
  moduleId: module.id,
  templateUrl: 'confirm.component.html'
})

export class ConfirmPageComponent implements OnInit {
  public resultMessage = '';
  public resultIsError = false;

  /**
   * Class constructor.
   */
  constructor (
    private _activatedRoute: ActivatedRoute,
    private _usersApi: UsersApiService
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {
      const snapshot = this._activatedRoute.snapshot;
      const code = snapshot.queryParams['code'];
      await this._usersApi.confirm(code).toPromise();
      this.resultIsError = false;
      this.resultMessage =
        'Your account has been activated. You can now log in.';
    } catch (error) {
      this.resultIsError = true;
      this.resultMessage = error.payload.message;
    }
  }
}
