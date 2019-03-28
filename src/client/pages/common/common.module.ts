import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { CopyrightFooterComponent } from './copyright-footer.component';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [],
  declarations: [
    CopyrightFooterComponent
  ],
  exports: [
    CopyrightFooterComponent
  ]
})
export class CommonModule { }
