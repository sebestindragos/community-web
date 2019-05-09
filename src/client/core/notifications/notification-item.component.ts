import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from '../users/session.service';
import { NotificationsService } from './notifications.service';
import { take } from 'rxjs/operators';
import { SocialService } from '../social/social.service';

@Component({
  moduleId: module.id,
  selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: [
    'notification-item.component.css'
  ]
})
export class NotificationItemComponent implements OnInit {
  @Input() notification: any;

  /**
   * Class constructor.
   */
  constructor (
    private _session: SessionService,
    private _notificationService: NotificationsService,
    private _socialService: SocialService
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Mark notification as seen.
   */
  async markSeen () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (token) {
        await this._notificationService
          .markAsSeen(this.notification._id, token).toPromise();
        await this._notificationService.decreaseUnseenCounter().toPromise();
        this.notification.seen = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Respond to a friend request.
   */
  async respondToFriendRequest (confirm: boolean) {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (!token) return;
      await this._socialService.updateFriendRequest(
        this.notification.data.requestId, confirm, token
      ).toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}
