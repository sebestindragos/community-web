import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'new-notifications-counter',
  templateUrl: 'new-notifications-counter.component.html'
})

export class NewNotificationsCounterComponent implements OnInit {
  public unseenNotificationsCount$: Observable<number>;
  /**
   * Class constructor.
   */
  constructor (
    private _notificationsService: NotificationsService
  ) {
    this.unseenNotificationsCount$ = this._notificationsService.unseenNotificationsCount$;
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }
}
