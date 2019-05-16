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
  private _cursor = ''; // id of the last anoucement
  private _canLoadMore = true;
  private _userId: string;

  public hasLoaded = false;
  public isFriend = false;
  public user: any;
  public wallPosts: any[] = [];

  /**
   * Class constructor.
   */
  constructor (
    private _usersApi: UsersApiService,
    private _session: SessionService,
    private _socialService: SocialService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._userId = this._activatedRoute.snapshot.params['id'];
  }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {
      const token = await this._session.jwt$.pipe(take(1)).toPromise();
      if (!token) return;

      this.user = await this._usersApi.getUserProfile(this._userId, token).toPromise();

      let friendList = await this._socialService.getFriendList(token).toPromise();
      this.isFriend = friendList.friendIds.findIndex((f: string) => f === this._userId) !== -1;
      this.hasLoaded = true;

      this.loadMore();
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

  /**
   * Load next batch of polls.
   */
  async loadMore () {
    if (this._canLoadMore) {
      this._canLoadMore = false;
      let token = await this._session.jwt$.pipe(take(1)).toPromise();
      let batch = await this._socialService.getUserPosts({
        userId: this._userId,
        fromId: this._cursor,
        limit: 10
      }, token || '').toPromise();

      if (batch.length > 0) {
        console.log('batch size', batch.length);
        this._canLoadMore = true;
        this._cursor = batch[batch.length - 1]._id;
        this.wallPosts = this.wallPosts.concat(batch);
      }
    }
  }
}
