import {
  Directive, Input, ElementRef,
  OnInit, OnDestroy, Renderer
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

/**
 * Directive used the add the appropriate Bootstrap classes
 * (is-valid, is-invalid) for form validation on elements based
 * on an Angular FormControl.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[form-field-validator]'
})
export class FormFieldValidatorDirective implements OnInit, OnDestroy {
  @Input('control') private _control: FormControl = undefined as any;
  private _subscription?: Subscription;

  /**
   * Class constructor.
   */
  constructor (
    private _renderer: Renderer,
    private _element: ElementRef
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    this._subscription = this._control.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        this._renderer.setElementClass(this._element.nativeElement, 'is-invalid', true);
        this._renderer.setElementClass(this._element.nativeElement, 'is-valid', false);
      } else if (status === 'VALID') {
        this._renderer.setElementClass(this._element.nativeElement, 'is-invalid', false);
        this._renderer.setElementClass(this._element.nativeElement, 'is-valid', true);
      }
    });
  }

  ngOnDestroy () {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
