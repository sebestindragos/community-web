import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../core/users/session.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Component used for displaying the 404 page.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ]
})
export class NotificationsPageComponent implements OnInit {
  public notifications$: Observable<any[]> = of([]);

  /**
   * Class constructor.
   */
  constructor (
    private _session: SessionService,
    private _notificationsService: NotificationsService
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (token) {
        this.notifications$ = this._notificationsService.getAllNotifications(token);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
