import { Component, ChangeDetectionStrategy, Input, OnInit, forwardRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractValueAccessor } from '../../core/abstract-value-accessor';

@Component({
  selector: 'app-individual-list',
  templateUrl: './individual-list.component.html',
  styleUrls: ['./individual-list.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IndividualListComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => IndividualListComponent), multi: true }
  ]
})
export class IndividualListComponent extends AbstractValueAccessor implements OnInit {
  individualsArray: FormArray;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initializeArray();
  }

  initializeArray(initialValue?: any) {
    this.individualsArray = this.formBuilder.array([]);
    this.handleChanges();
  }

  handleChanges() {
    this.individualsArray
      .valueChanges
      .subscribe(value => this.value = value);
  }

  addIndividual() {
    this.individualsArray.push(this.formBuilder.control({
      firstName: '',
      lastName: '',
      age: ''
    }));
  }

  validate(c: FormControl) {
    const returnValue = this.individualsArray.valid ? null : { invalidIndividuals: true };

    console.log('validating array', this.individualsArray.value, returnValue);

    return returnValue;
  }

  updateValueAndValidity() {
    this.individualsArray.updateValueAndValidity();
  }
}
