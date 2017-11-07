import { Component, ChangeDetectionStrategy, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AbstractValueAccessor } from '../../core/abstract-value-accessor';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IndividualComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => IndividualComponent), multi: true }
  ]
})
export class IndividualComponent extends AbstractValueAccessor implements OnInit {
  individualForm: FormGroup;
  showSmokerQuestion$: Observable<boolean>;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(initialValue?: any) {
    this.individualForm = this.buildFormGroup(initialValue);

    this.showSmokerQuestion$ = this.individualForm.get('age')
      .valueChanges
      .map(value => +value)
      .map(age => age >= 18)
      .distinctUntilChanged();

    this.handleChanges();
  }

  buildFormGroup(value?: any) {
    const group = this.formBuilder.group({
      firstName: [!!value ? value.firstName : '', Validators.required],
      lastName: [!!value ? value.lastName : '', Validators.required],
      age: [!!value ? value.age : '', Validators.required]
    });

    // with this line un-commented, the validity seems to be re-computed after all form
    // controls and components are initialized. The IndividualsComponent reports a valid
    // status for a fraction of a second (almost unnoticable) then changes to invalid

    // setTimeout(() => group.updateValueAndValidity(), 0);

    return group;
  }

  handleChanges() {
    this.individualForm
      .valueChanges
      .subscribe(value => this.value = value);

    this.showSmokerQuestion$
      .subscribe(visibility => this.setSmokerQuestionVisibility(visibility));
  }

  setSmokerQuestionVisibility(visibility: boolean) {
    console.log('setting smoker visibility', visibility);
    if (!!visibility) {
      this.individualForm.addControl('smoker', this.formBuilder.control(''));
    } else {
      this.individualForm.removeControl('smoker');
    }

    // with this line un-commented, the validity of the form properly becomes invalid
    // upon making the question visible following entery of an age >= 18

    // setTimeout(() => this.individualForm.updateValueAndValidity(), 0);
  }

  writeValue(value: any) {
    if (!!value) {
      console.log('setting individual value', value);

      this.individualForm.patchValue(value);
    }
  }

  validate(c: FormControl) {
    const returnValue = this.individualForm.valid ? null : { invalidIndividual: true };

    console.log('validating', this.individualForm.value, returnValue);

    return returnValue;
  }
}
