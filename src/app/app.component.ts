import { Component, OnInit } from '@angular/core';
import { INgxSelect2ExOption } from './ngx-select2-ex/interfaces/ngx-select2-ex-option';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup;
  Infinity = Infinity;
  ngxOptions: Array<INgxSelect2ExOption> = [
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
  ngxStringOptions: Array<any> = ['stringOptions1', 'stringOptions2', 'stringOptions3'];

  ngxOptionsSecond: Array<INgxSelect2ExOption> = [
    {
      id: '1',
      value: 'Option1'
    },
    {
      id: '2',
      value: 'Option2'
    }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      select2: [this.ngxOptions],
      select2Second: [this.ngxOptionsSecond]
    });
    this.form.valueChanges.subscribe(value => console.log(value));
  }

  toggleDisable() {
    this.form.get('select2').disabled ? this.form.get('select2').enable() : this.form.get('select2').disable();
  }

}
