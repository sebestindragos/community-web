import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const JWT_KEY = '@jwt';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public jwt$ = new BehaviorSubject<string | undefined>(undefined);
  public profile$ = new BehaviorSubject<any>(undefined);

  /**
   * Class constructor.
   */
  constructor () {
    // load jwt if it exists
    const token = localStorage.getItem(JWT_KEY);
    if (token)
      this.jwt$.next(token);
  }

  /**
   * Set jwt token.
   */
  setJwt (value: string) {
    this.jwt$.next(value);
    localStorage.setItem(JWT_KEY, value);
  }

  /**
   * Check if a user is logged in.
   */
  isLoggedIn () {
    return localStorage.getItem(JWT_KEY) !== null;
  }

  /**
   * Terminate user session.
   */
  logout () {
    localStorage.removeItem(JWT_KEY);
    this.jwt$.next(undefined);
  }

  /**
   * Set user profile.
   */
  setProfile (user: any) {
    this.profile$.next(user);
  }
}
