/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Host, Inject, Input, OnDestroy, OnInit, Optional, Self, SkipSelf, forwardRef} from '@angular/core';

import {BaseException} from '../../facade/exceptions';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS} from '../../validators';
import {AbstractFormGroupDirective} from '../abstract_form_group_directive';
import {ControlContainer} from '../control_container';
import {ReactiveErrors} from '../reactive_errors';

import {FormGroupDirective} from './form_group_directive';

export const formGroupNameProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupName)
};

/**
 * Syncs an existing form group to a DOM element.
 *
 * This directive can only be used as a child of {@link FormGroupDirective}.
 *
 * ```typescript
 * @Component({
 *   selector: 'my-app',
 *   template: `
 *     <div>
 *       <h2>Angular FormGroup Example</h2>
 *       <form [formGroup]="myForm">
 *         <div formGroupName="name">
 *           <h3>Enter your name:</h3>
 *           <p>First: <input formControlName="first"></p>
 *           <p>Middle: <input formControlName="middle"></p>
 *           <p>Last: <input formControlName="last"></p>
 *         </div>
 *         <h3>Name value:</h3>
 *         <pre>{{ nameGroup | json }}</pre>
 *         <p>Name is {{nameGroup?.valid ? "valid" : "invalid"}}</p>
 *         <h3>What's your favorite food?</h3>
 *         <p><input formControlName="food"></p>
 *         <h3>Form value</h3>
 *         <pre> {{ myForm | json }} </pre>
 *       </form>
 *     </div>
 *   `
 * })
 * export class App {
 *   nameGroup = new FormGroup({
 *       first: new FormControl('', Validators.required),
 *       middle: new FormControl(''),
 *       last: new FormControl('', Validators.required)
 *   });
 *
 *   myForm = new FormGroup({
 *     name: this.nameGroup,
 *     food: new FormControl()
 *   });
 * }
 * ```
 *
 * This example syncs the form group for the user's name. The value and validation state of
 * this group can be accessed separately from the overall form.
 *
 * @experimental
 */
@Directive({selector: '[formGroupName]', providers: [formGroupNameProvider]})
export class FormGroupName extends AbstractFormGroupDirective implements OnInit, OnDestroy {
  @Input('formGroupName') name: string;

  constructor(
      @Optional() @Host() @SkipSelf() parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this._parent = parent;
    this._validators = validators;
    this._asyncValidators = asyncValidators;
  }

  /** @internal */
  _checkParentType(): void {
    if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective)) {
      ReactiveErrors.groupParentException();
    }
  }
}
