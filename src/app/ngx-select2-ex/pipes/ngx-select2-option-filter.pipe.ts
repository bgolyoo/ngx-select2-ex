import { Pipe, PipeTransform } from '@angular/core';
import { NgxSelect2ExOptionHandler } from '../classes/ngx-select2-ex-option-handler';

@Pipe({
  name: 'ngxSelect2OptionFilter'
})
export class NgxSelect2OptionFilterPipe implements PipeTransform {

  transform(options: Array<NgxSelect2ExOptionHandler>, filter: string): Array<NgxSelect2ExOptionHandler> {
    return this.filterOptions(options, filter);
  }

  filterOptions(options: Array<NgxSelect2ExOptionHandler>, filter: string): Array<NgxSelect2ExOptionHandler> {
    if (filter) {
      return options.filter((option: NgxSelect2ExOptionHandler) => option.value.toLowerCase().includes(filter.toLowerCase()));
    }
    return options;
  }

}
