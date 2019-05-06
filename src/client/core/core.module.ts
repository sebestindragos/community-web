import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { NotificationItemComponent } from './notifications/notification-item.component';
import { NewNotificationsCounterComponent } from './notifications/new-notifications-counter.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    NotificationItemComponent,
    NewNotificationsCounterComponent
  ],
  exports: [
    NotificationItemComponent,
    NewNotificationsCounterComponent
  ]
})
export class CoreModule {}
