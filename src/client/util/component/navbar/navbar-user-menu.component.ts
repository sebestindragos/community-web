import { Component, OnInit } from '@angular/core';

// types
import { ErrorUtil } from '../../helpers/errorUtil';

/**
 * Component used for rendering a user menu item
 * with navbar support in mind.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'community-navbar-user-menu',
  templateUrl: 'navbar-user-menu.component.html',
  styleUrls: [
    'navbar-user-menu.component.css'
  ]
})
export class NavbarUserMenuComponent implements OnInit {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {

    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
