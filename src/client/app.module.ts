import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LocalStorage } from './util/storage/localStorage';

import { UtilModule } from './util/util.module';
import { PagesModule, ROUTES as CORE_ROUTES } from './pages/pages.module';

import { ToastNotificationsService } from './util/component/toast-notifications/toast-notifications.service';

import {
  ENVIRONMENT_CONFIG, IEnvironmentConfig, IServerConfig
} from './environment.config';
import { CoreModule } from './core/core.module';

export function init (
  http: HttpClient,
  env: IEnvironmentConfig
) {
  return async () => {
    let serverConfig = await http.get(`/config?cache-buster=${new Date().toISOString()}`).toPromise() as IServerConfig;
    env.api = serverConfig.api;
  };
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'community'
    }),
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserTransferStateModule,

    PagesModule,
    UtilModule,
    CoreModule,

    RouterModule.forRoot([
      ...CORE_ROUTES
    ])
  ],
  providers: [
    LocalStorage,
    {provide: ENVIRONMENT_CONFIG, useValue: {
      baseUrl: '/'
    }, multi: true},
    {provide: APP_INITIALIZER, useFactory: init, deps: [
      HttpClient, ENVIRONMENT_CONFIG
    ], multi: true},

    ToastNotificationsService
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
