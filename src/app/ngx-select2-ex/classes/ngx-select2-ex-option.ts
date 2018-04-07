import { INgxSelect2ExOption } from '../interfaces/ngx-select2-ex-option';

export class NgxSelect2ExOption implements INgxSelect2ExOption {

  id: number | string;
  value: string;
  disabled: boolean;
  selected: boolean;

  constructor(id: number | string, value: string, disabled?: boolean, selected?: boolean) {
    this.id = id;
    this.value = value;
    this.disabled = !!disabled;
    this.selected = !!selected;
  }

}
