import { Component, OnInit } from '@angular/core';
import { INgxSelect2ExOption } from './ngx-select2-ex/interfaces/ngx-select2-ex-option';
import { FormBuilder, FormGroup } from '@angular/forms';
import { INgxSelect2ExLanguageInputs } from './ngx-select2-ex/interfaces/ngx-select2-ex-language-inputs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup;
  Infinity = Infinity;

  basicOptions: Array<string> = ['Basic option 1', 'Basic option 2', 'Basic option 3', 'Basic option 4', 'Basic option 5'];
  options: Array<INgxSelect2ExOption> = [
    {
      id: '1',
      value: 'Option1'
    },
    {
      id: '2',
      value: 'Option2',
      disabled: true
    },
    {
      id: '3',
      value: 'Option3',
      selected: true
    },
    {
      id: '4',
      value: 'Option4',
      selected: true
    },
    {
      id: '5',
      value: 'Option5'
    }
  ];
  language: INgxSelect2ExLanguageInputs = {
    inputTooShort: () => {
      return 'Yo man, your input is way too short...';
    }
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      select2Single: [this.options],
      select2Multi: [this.options]
    });
    this.form.valueChanges.subscribe(value => console.log(value));
  }

  toggleDisable() {
    this.form.get('select2Single').disabled ? this.form.get('select2Single').enable() : this.form.get('select2Single').disable();
    this.form.get('select2Multi').disabled ? this.form.get('select2Multi').enable() : this.form.get('select2Multi').disable();
  }

}
