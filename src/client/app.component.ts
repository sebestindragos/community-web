import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { setLocale } from 'exceptional.js';
import { SessionService } from './core/users/session.service';
import { UsersApiService } from './core/users/usersAPI.service';
import { NotificationsService } from './core/notifications/notifications.service';

@Component({
  moduleId: module.id,
  selector: 'community',
  templateUrl: 'app.component.html',
  styleUrls: [
  ],
  providers: [
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscription?: Subscription;
  public profile$: any;

  /**
   * Class constructor.
   */
  constructor (
    private _router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _session: SessionService,
    private _usersApi: UsersApiService,
    private _notificationsApi: NotificationsService
  ) {
    this.profile$ = this._session.profile$;
  }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    // initialize error subsystem
    setLocale('en');

    if (isPlatformBrowser(this._platformId)) {
      this._subscription = this._router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe(() => window.scroll(0, 0));
    }

    // load user profile
    this._session.jwt$.subscribe(async token => {
      if (token) {
        const result: any = await this._usersApi.getOwnProfile(token).toPromise();
        this._session.setProfile(result.user);
        await this._notificationsApi.loadUnseenCount(token).toPromise();
        this._notificationsApi.startLiveNotifications(token);
      } else {
        this._session.setProfile(undefined);
      }
    });
  }

  ngOnDestroy () {
    if (this._subscription)
      this._subscription.unsubscribe();
  }

  /**
   * Check if any user is logged in
   */
  hasSession () {
    return this._session.isLoggedIn();
  }

  /**
   * Logout current user.
   */
  logout () {
    this._session.logout();
  }
}
