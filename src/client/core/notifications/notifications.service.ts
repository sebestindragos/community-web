import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';
import { catchError, map, take } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import * as SocketIO from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _io: SocketIOClient.Socket | undefined;
  public unseenNotificationsCount$ = new BehaviorSubject<number>(0);

  /**
   * Class constructor.
   */
  constructor (
    private _httpClient: HttpClient,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
  ) { }

  /**
   * Fetch notifications.
   */
  getAllNotifications (token: string) {
    const url = `${this.__getApiHost()}/notifications`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => result.notifications))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Mark a notification as seen.
   */
  markAsSeen (notificationId: string, token: string) {
    const url = `${this.__getApiHost()}/notifications/${notificationId}/seen`;
    return this._httpClient.put(url, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Load unseen notifications count.
   */
  loadUnseenCount (token: string) {
    const url = `${this.__getApiHost()}/notifications/unseen-count`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => {
      this.unseenNotificationsCount$.next(result.value);
    }))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Decrease unseen counter.
   */
  decreaseUnseenCounter () {
    return this.unseenNotificationsCount$.pipe(take(1))
      .pipe(map(value => this.unseenNotificationsCount$.next(value - 1)));
  }

  /**
   * Increase unseen counter.
   */
  increaseUnseenCounter () {
    return this.unseenNotificationsCount$.pipe(take(1))
      .pipe(map(value => this.unseenNotificationsCount$.next(value + 1)));
  }

  /**
   * Start listening for new notifications.
   */
  startLiveNotifications (token: string) {
    this._io = SocketIO.connect(this._env.api.hostname, {query: `jwt=${token}`});
    if (this._io) {
      this._io.on('notification', () => {
        this.increaseUnseenCounter().subscribe(() => {});
      });
    }
  }

  /**
   * Get API base url.
   */
  private __getApiHost () {
    return `${this._env.api.hostname}/api/${this._env.api.version}`;
  }
}
