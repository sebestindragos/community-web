import { Directive, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

import {VALIDATION_ERRORS} from './validation-errors';

/**
 * Component used for rendering the output of a form control error.
 */
@Directive({
  selector: '[form-feedback]',
})
export class FormValidationFeedbackDirective implements OnInit {
  @Input('control') private _control: FormControl = undefined as any;

  public text: string = '';

  /**
   * Class constructor.
   */
  constructor (
    private _element: ElementRef,
    private _renderer: Renderer2
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    this._control.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        this._renderer.setProperty(this._element.nativeElement, 'textContent', this._getError());
      }
    });
  }

  /**
   * Get the text of the control error.
   */
  private _getError () : string {
    if (this._control.errors === null)
      return '';

    for (let error in this._control.errors) {
      if (this._control.hasError(error))
        return this._formatMessage(error, this._control.errors[error]);
    }

    return '';
  }

  /**
   * Format control validation message.
   */
  private _formatMessage (validationName: string, validationInfo: any) : string {
    let template: string = VALIDATION_ERRORS[validationName];
    for (let key in validationInfo) {
      template = template.replace(`{${key}}`, validationInfo[key]);
    }

    return template;
  }
}
