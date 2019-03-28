import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// rxjs imports
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

import { AppComponent } from './app.component';

// other modules
import { UtilModule } from './util/util.module';
import { PagesModule, ROUTES as CORE_ROUTES } from './pages/pages.module';

// users
import { ToastNotificationsService } from './util/component/toast-notifications/toast-notifications.service';

import {
  ENVIRONMENT_CONFIG
} from './environment.config';

export function init (
) {
  return async () => {
  };
}

@NgModule({
  imports: [
    ServerModule,
    RouterModule,
    BrowserModule.withServerTransition({
      appId: 'community'
    }),
    // .BrowserAnimationsModule,
    HttpClientModule,
    ServerTransferStateModule,

    UtilModule,
    PagesModule,

    RouterModule.forRoot([
      ...CORE_ROUTES
    ])
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: init, deps: [
      ENVIRONMENT_CONFIG
    ], multi: true},

    ToastNotificationsService
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
