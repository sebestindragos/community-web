import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { NotificationItemComponent } from './notifications/notification-item.component';
import { NewNotificationsCounterComponent } from './notifications/new-notifications-counter.component';
import { WallPostListComponent } from './social/wall-post-list.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    NotificationItemComponent,
    NewNotificationsCounterComponent,
    WallPostListComponent
  ],
  exports: [
    NotificationItemComponent,
    NewNotificationsCounterComponent,
    WallPostListComponent
  ]
})
export class CoreModule {}
