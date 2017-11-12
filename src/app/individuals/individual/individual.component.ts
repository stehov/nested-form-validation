import { Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AbstractValueAccessor } from '../../core/abstract-value-accessor';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent extends AbstractValueAccessor implements OnInit {
  individualForm: FormGroup;
  showSmokerQuestion$: Observable<boolean>;

  constructor( @Self() private controlDirective: NgControl,
    private formBuilder: FormBuilder) {
    super();

    controlDirective.valueAccessor = this;

    this.individualForm = this.buildFormGroup();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.showSmokerQuestion$ = this.individualForm.get('age')
      .valueChanges
      .map(value => +value)
      .map(age => age >= 18)
      .distinctUntilChanged();

    this.handleChanges();

    const control = this.controlDirective.control;

    const validators = control.validator
      ? [control.validator, this.validate.bind(this)]
      : this.validate.bind(this);

    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  buildFormGroup(value?: any) {
    const group = this.formBuilder.group({
      firstName: [!!value ? value.firstName : '', Validators.required],
      lastName: [!!value ? value.lastName : '', Validators.required],
      age: [!!value ? value.age : '', Validators.required]
    });

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
    if (!!visibility) {
      this.individualForm.addControl('smoker', this.formBuilder.control(''));
    } else {
      this.individualForm.removeControl('smoker');
    }
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
