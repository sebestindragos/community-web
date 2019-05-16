import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { SessionService } from '../../core/users/session.service';
import { SocialService } from '../../core/social/social.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

/**
 * Component used for displaying the home page.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePageComponent implements OnInit, OnDestroy {
  private _cursor = ''; // id of the last anoucement
  private _canLoadMore = true;

  public SCHEMA = {};
  public isLoggedIn$: Observable<boolean>;
  public newPostText = '';
  public wallPosts: any[] = [];

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _title: Title,
    private _meta: Meta,
    private _session: SessionService,
    private _socialService: SocialService
  ) {
    this.isLoggedIn$ = this._session.jwt$.pipe(map(jwt => !!jwt));
  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {
      if (isPlatformServer(this._platformId)) {
        let descriptionTag = this._meta.getTag('description');
        this._meta.addTags([{
          property: 'og:title',
          content: this._title.getTitle()
        }, {
          property: 'og:description',
          content: descriptionTag ? descriptionTag.content : ''
        }, {
          property: 'og:type',
          content: 'website'
        }, {
          property: 'og:url',
          content: this._env.baseUrl
        }, {
          property: 'og:image',
          content: this._getLogoURL()
        }]);

        this.SCHEMA = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'image': this._getLogoURL(),
          'name': this._title.getTitle(),
          'url': this._env.baseUrl
        };
      }
      this.loadMore();
    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Create a new post.
   */
  createPost () {
    this._session.jwt$.pipe(switchMap(
      token => this._socialService.createWallPost(this.newPostText, token || '')
    )).subscribe((newPost: any) => {
      this.newPostText = '';
      this.wallPosts.unshift(newPost);
    });
  }

  /**
   * Load next batch of polls.
   */
  async loadMore () {
    if (this._canLoadMore) {
      this._canLoadMore = false;
      let token = await this._session.jwt$.pipe(take(1)).toPromise();
      let batch = await this._socialService.getWallPosts({
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

  /**
   * Get logo URL for meta tags.
   */
  private _getLogoURL () : string {
    return `${this._env.baseUrl}assets/logo-mono.png`;
  }
}
