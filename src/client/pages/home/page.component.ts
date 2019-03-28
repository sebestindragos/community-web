import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';
import { ErrorUtil } from '../../util/helpers/errorUtil';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit, OnDestroy {
  public SCHEMA = {};

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _title: Title,
    private _meta: Meta
  ) { }

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
    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Get logo URL for meta tags.
   */
  private _getLogoURL () : string {
    return `${this._env.baseUrl}assets/logo-mono.png`;
  }
}
