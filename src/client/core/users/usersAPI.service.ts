import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  /**
   * Class constructor.
   */
  constructor (
    private _httpClient: HttpClient,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
  ) {}

  /**
   * Create a new account.
   */
  create (params: any) {
    const url = `${this.__getApiHost()}/users/register`;
    return this._httpClient.post(url, params).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Confirm an account via code.
   */
  confirm (code: string) {
    const url = `${this.__getApiHost()}/users/confirm`;
    return this._httpClient.get(url, {
      params: { code }
    }).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Authenticate a user.
   */
  authenticate (params: any) {
    const url = `${this.__getApiHost()}/users/login`;
    return this._httpClient.post(url, params).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get own user profile.
   */
  getOwnProfile (token: string) {
    const url = `${this.__getApiHost()}/users/me`;
    return this._httpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Search users.
   */
  search (term: string, token: string) {
    const url = `${this.__getApiHost()}/users?q=${encodeURIComponent(term)}`;
    return this._httpClient.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => result.value))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get own user profile.
   */
  getUserProfile (id: string, token: string) {
    const url = `${this.__getApiHost()}/users/${id}`;
    return this._httpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .pipe(map((result: any) => result.value))
    .pipe(catchError(err => throwError(err.error)));
  }

  /**
   * Get API base url.
   */
  private __getApiHost () {
    return `${this._env.api.hostname}/api/${this._env.api.version}`;
  }
}
