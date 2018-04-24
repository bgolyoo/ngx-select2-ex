import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxSelect2ExOptionHandler } from '../../classes/ngx-select2-ex-option-handler';
import { NgxSelect2ExService } from '../../services/ngx-select2-ex.service';
import { Subscription } from 'rxjs/Subscription';
import { INgxSelect2ExLanguageInputs } from '../../interfaces/ngx-select2-ex-language-inputs';
import { NgxSelect2ExLanguageInputs } from '../../classes/ngx-select2-ex-language-inputs';
import { INgxSelect2ExOption } from '../../interfaces/ngx-select2-ex-option';

@Component({
  selector: 'app-ngx-select2-ex',
  templateUrl: './ngx-select2-ex.component.html',
  styleUrls: ['./ngx-select2-ex.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSelect2ExComponent),
      multi: true
    },
    NgxSelect2ExService
  ]
})
export class NgxSelect2ExComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() options: Array<INgxSelect2ExOption> | Array<string> | null = null;
  @Input() disabled: boolean | null = null;

  @Input() multi: boolean | null = null;
  @Input() theme: string | null = null;
  @Input() minimumResultsForSearch: number | null = null;
  @Input() minimumInputLength: number | null = null;
  @Input() maximumInputLength: number | null = null;
  @Input() language: INgxSelect2ExLanguageInputs | null = null;
  @Input() selectOnClose: boolean | null = false;
  @Input() closeOnSelect: boolean | null = true;

  @Input() allowClear = false;
  @Input() placeholder: string | null = null;

  isOpen: boolean;
  isInFocus: boolean;
  selection: Array<NgxSelect2ExOptionHandler> = [];

  set search(search: string) {
    this.ngxSelect2ExService.search = search;
  }

  get search(): string {
    return this.ngxSelect2ExService.search;
  }

  private subscriptions: Array<Subscription> = [];
  private propagateChange = (_: any) => { };

  constructor(public ngxSelect2ExService: NgxSelect2ExService) { }

  ngOnInit() {
    this.initStaticInputValues();
    this.subscribeToSelection();
    this.subscribeToIsOpen();
    this.subscribeToIsInFocus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue.length &&
      changes['options'].previousValue !== changes['options'].currentValue) {
      this.initOptions(changes['options'].currentValue);
    }
    if (changes['disabled'] !== undefined &&
      changes['disabled'].previousValue !== changes['disabled'].currentValue) {
      this.ngxSelect2ExService.disabled = changes['disabled'].currentValue;
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  writeValue(value: Array<INgxSelect2ExOption> | Array<string>) {
    this.initOptions(value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.ngxSelect2ExService.disabled = isDisabled;
  }

  getContainerThemeClass(): string {
    return 'select2-container--' + this.ngxSelect2ExService.theme;
  }

  getStyleOfSearchListItem() {
    const width = (!this.selection || !this.selection.length) && this.placeholder ? '100%' : null;
    return { 'width': width };
  }

  getStyleOfInlineInput(search: string) {
    if (!search && (!this.selection || !this.selection.length) && this.placeholder) {
      return { 'width': '100%' };
    }
    const width = search ? `${((search.length + 1) * 0.75)}em` : '0.75em';
    return { 'width': width };
  }

  getInlineInputPlaceholder(): string {
    return (!this.selection || !this.selection.length) && this.placeholder ? this.placeholder : '';
  }

  clearSelection() {
    if (this.shouldShowClearSelectionButton() && (!this.multi && this.placeholder || this.multi)) {
      this.ngxSelect2ExService.clear();
    }
  }

  shouldShowClearSelectionButton(): boolean {
    return this.allowClear && this.selection && !!this.selection.length;
  }

  shouldShowPlaceholder(): boolean {
    return (!this.selection || !this.selection.length) && !!this.placeholder;
  }

  getTitleTooltipText(): string {
    if (this.selection && this.selection.length && this.selection[0].value) {
      return this.selection[0].value;
    } else if (this.placeholder) {
      return this.placeholder;
    } else {
      return '';
    }
  }

  deselect(optionHandlerToDeselect: NgxSelect2ExOptionHandler) {
    this.ngxSelect2ExService.deselect(optionHandlerToDeselect);
  }

  private subscribeToSelection(): void {
    this.subscriptions.push(this.ngxSelect2ExService.getSelectionAsObservable()
      .subscribe((selection: Array<NgxSelect2ExOptionHandler>) => {
        this.selection = selection;
        this.propagateChange(this.selection);
      })
    );
  }

  private subscribeToIsOpen(): void {
    this.subscriptions.push(this.ngxSelect2ExService.getIsOpenAsObservable()
      .subscribe((isOpen: boolean) => this.isOpen = isOpen));
  }

  private subscribeToIsInFocus(): void {
    this.subscriptions.push(this.ngxSelect2ExService.getIsInFocusAsObservable()
      .subscribe((isInFocus: boolean) => this.isInFocus = isInFocus));
  }

  private initOptions(options: Array<INgxSelect2ExOption> | Array<string>) {
    if (this.isStringList(options)) {
      this.ngxSelect2ExService.options = options.map(
        (option: string, index: number) => new NgxSelect2ExOptionHandler(index, option)
      );
    } else if (this.isOptionInterfaceList(options)) {
      this.ngxSelect2ExService.options = options.map(
        (option: INgxSelect2ExOption) => new NgxSelect2ExOptionHandler(option.id, option.value, option.disabled, option.selected)
      );
    } else {
      throw new Error('Input for options array should be of type Array<string> or Array<INgxSelect2ExOption>.');
    }
  }

  private isStringList(list: Array<any> | null): list is Array<string> {
    return list && list.every((item: any) => {
      return typeof item === 'string';
    });
  }

  private isOptionInterfaceList(list: Array<any> | null): list is Array<INgxSelect2ExOption> {
    return list && list.every((item: any) => {
      return 'id' in item && 'value' in item;
    });
  }

  private defaultChangeListener(changes: SimpleChanges, fieldName: string) {
    if (changes[fieldName] && changes[fieldName].previousValue !== changes[fieldName].currentValue) {
      this.ngxSelect2ExService[fieldName] = changes[fieldName].currentValue;
    }
  }

  private initStaticInputValues() {
    this.defaultInputSetter('multi');
    this.defaultInputSetter('theme');
    this.defaultInputSetter('minimumResultsForSearch');
    this.defaultInputSetter('minimumInputLength');
    this.defaultInputSetter('maximumInputLength',
      this.minimumInputLength && this.maximumInputLength && this.maximumInputLength < this.minimumInputLength ?
        this.minimumInputLength :
        this.maximumInputLength);
    this.defaultInputSetter('language', new NgxSelect2ExLanguageInputs(this.language));
    this.defaultInputSetter('selectOnClose');
    this.defaultInputSetter('closeOnSelect');
  }

  private defaultInputSetter(inputField: string, optionalValue?: any) {
    if (this[inputField] !== null) {
      this.ngxSelect2ExService[inputField] = optionalValue ? optionalValue : this[inputField];
    }
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
