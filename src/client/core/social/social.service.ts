import { Injectable, Inject } from '@angular/core';
import { IEnvironmentConfig, ENVIRONMENT_CONFIG } from '../../environment.config';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  /**
   * Class constructor.
   */
  constructor (
    private _httpClient: HttpClient,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig
  ) { }

  /**
   * Create a new friend request.
   */
  createFriendRequest (toUserId: string, token: string) {
    const url = `${this.__getApiHost()}/social/friend-request`;
    return this._httpClient.post(url, {
      friendId: toUserId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Respond to a friend request.
   */
  updateFriendRequest (id: string, confirm: boolean, token: string) {
    const url = `${this.__getApiHost()}/social/friend-request/${id}/status`;
    return this._httpClient.put(url, {
      status: confirm ? 1 : 2
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Delete a friend.
   */
  deleteFriend (friendId: string, token: string) {
    const url = `${this.__getApiHost()}/social/friends/${friendId}`;
    return this._httpClient.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get user friend list.
   */
  getFriendList (token: string) {
    const url = `${this.__getApiHost()}/social/friends`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => result.friendsList))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Create wall post.
   */
  createWallPost (text: string, token: string) {
    const url = `${this.__getApiHost()}/social/wall-post`;
    return this._httpClient.post<any>(url, {
      text
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => result.wallPost))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get wall posts.
   */
  getWallPosts (
    params: {
      fromId?: string,
      limit: number
    },
    token: string
  ): Observable<any[]> {
    const url = `${this.__getApiHost()}/social/wall-post`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        fromId: params.fromId || '',
        limit: String(params.limit)
      }
    })
    .pipe(map((result: any) => result.wallPosts))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get user posts.
   */
  getUserPosts (
    params: {
      userId: string,
      fromId?: string,
      limit: number
    },
    token: string
  ): Observable<any[]> {
    const url = `${this.__getApiHost()}/social/user/${params.userId}/wall-post`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        fromId: params.fromId || '',
        limit: String(params.limit)
      }
    })
    .pipe(map((result: any) => result.wallPosts))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get API base url.
   */
  private __getApiHost () {
    return `${this._env.api.hostname}/api/${this._env.api.version}`;
  }
}
