import { Pipe, PipeTransform } from '@angular/core';
import { NgxSelect2ExOptionHandler } from '../classes/ngx-select2-ex-option-handler';
import { NgxSelect2ExService } from '../services/ngx-select2-ex.service';

@Pipe({
  name: 'ngxSelect2OptionFilter'
})
export class NgxSelect2OptionFilterPipe implements PipeTransform {

  transform(
    options: Array<NgxSelect2ExOptionHandler>,
    filter: string,
    minimumResultsForSearch: number,
    minimumInputLength: number | null = null,
    maximumInputLength: number | null = null
  ): Array<NgxSelect2ExOptionHandler> {
    return this.filterOptions(options, filter, minimumResultsForSearch, minimumInputLength, maximumInputLength);
  }

  filterOptions(
    options: Array<NgxSelect2ExOptionHandler>,
    filter: string,
    minimumResultsForSearch: number,
    minimumInputLength: number | null = null,
    maximumInputLength: number | null = null
  ): Array<NgxSelect2ExOptionHandler> {

    if (options.length < minimumResultsForSearch) {
      return options;
    } else if (minimumInputLength !== null && maximumInputLength !== null) {
      return this.rangeInputFilteringHandler(options, filter, minimumInputLength, maximumInputLength);
    } else if (minimumInputLength !== null) {
      return this.minimumInputFilteringHandler(options, filter, minimumInputLength);
    } else if (maximumInputLength !== null) {
      return this.maximumInputFilteringHandler(options, filter, maximumInputLength);
    } else {
      return this.doFiltering(options, filter);
    }
  }

  private rangeInputFilteringHandler(
    options: Array<NgxSelect2ExOptionHandler>,
    filter: string,
    minimumInputLength: number,
    maximumInputLength: number
  ): Array<NgxSelect2ExOptionHandler> {
    if (
      this.isfilterTextBiggerThanMinimumInputLength(filter, minimumInputLength) &&
      this.isfilterTextSmallerThanMaximumInputLength(filter, maximumInputLength)
    ) {
      return this.doFiltering(options, filter);
    } else {
      return <Array<NgxSelect2ExOptionHandler>>[];
    }
  }

  private minimumInputFilteringHandler(
    options: Array<NgxSelect2ExOptionHandler>,
    filter: string,
    minimumInputLength: number
  ): Array<NgxSelect2ExOptionHandler> {
    if (this.isfilterTextBiggerThanMinimumInputLength(filter, minimumInputLength)) {
      return this.doFiltering(options, filter);
    } else {
      return <Array<NgxSelect2ExOptionHandler>>[];
    }
  }

  private maximumInputFilteringHandler(
    options: Array<NgxSelect2ExOptionHandler>,
    filter: string,
    maximumInputLength: number
  ): Array<NgxSelect2ExOptionHandler> {
    if (!filter || this.isfilterTextSmallerThanMaximumInputLength(filter, maximumInputLength)) {
      return this.doFiltering(options, filter);
    } else {
      return <Array<NgxSelect2ExOptionHandler>>[];
    }
  }

  private isfilterTextBiggerThanMinimumInputLength(filter: string, minimumInputLength: number): boolean {
    return filter && minimumInputLength <= filter.length;
  }

  private isfilterTextSmallerThanMaximumInputLength(filter: string, maximumInputLength: number): boolean {
    return filter && filter.length <= maximumInputLength;
  }

  private doFiltering(options: Array<NgxSelect2ExOptionHandler>, filter: string): Array<NgxSelect2ExOptionHandler> {
    if (filter) {
      return options.filter((option: NgxSelect2ExOptionHandler) => option.value.toLowerCase().includes(filter.toLowerCase()));
    } else {
      return options;
    }
  }

}
