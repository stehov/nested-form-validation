import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { AbstractValueAccessor } from '../core/abstract-value-accessor';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => QuestionComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => QuestionComponent), multi: true }
  ]
})
export class QuestionComponent extends AbstractValueAccessor implements OnInit {
  @Input() text: string;
  questionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initializeForm();
    this.handleChanges();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      response: ['', Validators.required]
    });
  }

  handleChanges() {
    this.questionForm.get('response')
      .valueChanges
      .subscribe(value => this.value = value);
  }

  writeValue(value: any) {
    this.questionForm.get('response').setValue(value);
  }

  validate(control: FormControl) {
    return this.questionForm.valid ? null : { questionRequired: true };
  }
}
