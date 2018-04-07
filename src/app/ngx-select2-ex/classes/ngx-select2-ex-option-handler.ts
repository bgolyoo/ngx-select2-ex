import { NgxSelect2ExOption } from './ngx-select2-ex-option';

export class NgxSelect2ExOptionHandler extends NgxSelect2ExOption {

  highlighted?: boolean;

  constructor(id: number | string, value: string, disabled?: boolean, selected?: boolean, highlighted?: boolean) {
    super(id, value, !!disabled, !!selected);
    this.highlighted = !!highlighted;
  }

  static copy(optionHandler: NgxSelect2ExOptionHandler): NgxSelect2ExOptionHandler {
    return new NgxSelect2ExOptionHandler(
      optionHandler.id,
      optionHandler.value,
      optionHandler.disabled,
      optionHandler.selected,
      optionHandler.highlighted
    );
  }

  static copyArray(arrayOfOptionHandlers: Array<NgxSelect2ExOptionHandler>): Array<NgxSelect2ExOptionHandler> {
    const options = arrayOfOptionHandlers.map((option: NgxSelect2ExOptionHandler) => NgxSelect2ExOptionHandler.copy(option));
    return [...options];
  }

}
