import {Component} from '@angular/core';
import { UsersApiService } from '../../core/users/usersAPI.service';
import { SessionService } from '../../core/users/session.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SocialService } from '../../core/social/social.service';

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
export class UserProfilePageComponent {
  public hasLoaded = false;
  public isFriend = false;
  public user: any;

  /**
   * Class constructor.
   */
  constructor (
    private _usersApi: UsersApiService,
    private _session: SessionService,
    private _socialService: SocialService,
    private _activatedRoute: ActivatedRoute
  ) {}

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (!token) return;

      let userId = this._activatedRoute.snapshot.params['id'];
      this.user = await this._usersApi.getUserProfile(userId, token).toPromise();

      let friendList = await this._socialService.getFriendList(token).toPromise();
      this.isFriend = friendList.friendIds.findIndex((f: string) => f === userId) !== -1;
      this.hasLoaded = true;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Send a friend request to this user.
   */
  async addFriend () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (!token) return;

      let userId = this._activatedRoute.snapshot.params['id'];
      await this._socialService.createFriendRequest(userId, token).toPromise();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Remove a friend
   */
  async removeFriend () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (!token) return;

      let userId = this._activatedRoute.snapshot.params['id'];
      await this._socialService.deleteFriend(userId, token).toPromise();
      this.isFriend = false;
    } catch (error) {
      console.error(error);
    }
  }
}
