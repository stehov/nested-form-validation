import { Component, ChangeDetectorRef, OnInit, Self } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';

import { AbstractValueAccessor } from '../../core/abstract-value-accessor';

@Component({
  selector: 'app-individual-list',
  templateUrl: './individual-list.component.html',
  styleUrls: ['./individual-list.component.css']
})
export class IndividualListComponent extends AbstractValueAccessor implements OnInit {
  individualsArray: FormArray;
  form: FormGroup;

  constructor( @Self() private controlDirective: NgControl,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef) {
    super();

    controlDirective.valueAccessor = this;
  }

  ngOnInit() {
    this.initializeArray();
  }

  initializeArray(initialValue?: any) {
    this.individualsArray = this.formBuilder.array([]);

    const control = this.controlDirective.control;
    control.setValidators(this.validate.bind(this));
    control.updateValueAndValidity();

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

    // without the detectChanges call an ExpressionChangedAfterItHasBeenCheckedError error
    // gets thrown
    this.cd.detectChanges();
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
