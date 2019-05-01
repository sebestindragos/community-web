import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SharedModule } from '../shared.module';
import { UtilModule } from '../util/util.module';
import { CoreModule } from '../core/core.module';
import { CommonModule } from './common/common.module';

// services
import { AuthGuard } from './common/auth.guard';

// pages
import { NotFoundPageComponent } from './not-found/page.component';
import { HomePageComponent } from './home/page.component';
import { HomePageResolver } from './home/page.resolver';
import { SignupPageComponent } from './user-auth/signup.component';
import { ConfirmPageComponent } from './user-auth/confirm.component';
import { LoginPageComponent } from './user-auth/login.component';

export const ROUTES: Route[] = [{
  path: '', component: HomePageComponent,
  resolve: {pageData: HomePageResolver}
}, {
  path: 'signup', component: SignupPageComponent
}, {
  path: 'confirm', component: ConfirmPageComponent
}, {
  path: 'login', component: LoginPageComponent
}, {
  path: '404', component: NotFoundPageComponent
}, {
  path: '**', redirectTo: '404'
}];

@NgModule({
  imports: [
    RouterModule,

    SharedModule,
    UtilModule,
    CoreModule,
    CommonModule
  ],
  providers: [
    HomePageResolver,
    AuthGuard
  ],
  declarations: [
    // pages
    NotFoundPageComponent,
    HomePageComponent,
    SignupPageComponent,
    ConfirmPageComponent,
    LoginPageComponent
  ],
  exports: [
    CommonModule
  ],
  entryComponents: [
  ]
})
export class PagesModule { }
