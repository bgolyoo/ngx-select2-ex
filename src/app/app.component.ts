import { Component } from '@angular/core';
import { INgxSelect2ExOption } from './ngx-select2-ex/interfaces/ngx-select2-ex-option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Infinity = Infinity;
  ngxOptions: Array<INgxSelect2ExOption> = [
    {
      id: '1',
      value: 'Option1'
    },
    {
      id: '2',
      value: 'Option2'
    },
    {
      id: '3',
      value: 'Option3'
    },
    {
      id: '4',
      value: 'Option4'
    },
    {
      id: '5',
      value: 'Option5'
    }
  ];
}
