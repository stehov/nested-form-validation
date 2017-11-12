import { Component, Input, OnInit, Self } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';

import { AbstractValueAccessor } from '../core/abstract-value-accessor';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent extends AbstractValueAccessor implements OnInit {
  @Input() text: string;
  questionForm: FormGroup;

  constructor( @Self() private controlDirective: NgControl,
    private formBuilder: FormBuilder) {
    super();

    controlDirective.valueAccessor = this;

    this.questionForm = this.formBuilder.group({
      response: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.handleChanges();
  }

  initializeForm() {
    const control = this.controlDirective.control;

    const validators = control.validator
      ? [control.validator, this.validate.bind(this)]
      : this.validate.bind(this);

    control.setValidators(validators);

    // without wrapping in setTimeout an ExpressionChangedAfterItHasBeenCheckedError error
    // gets thrown
    setTimeout(() => control.updateValueAndValidity(), 0);
  }

  handleChanges() {
    this.questionForm.get('response')
      .valueChanges
      .subscribe(value => this.value = value);
  }

  writeValue(value: any) {
    this.questionForm.get('response').setValue(value, { emitEvent: false });
  }

  validate(control: FormControl) {
    return this.questionForm.get('response').valid ? null : { questionRequired: true };
  }
}
