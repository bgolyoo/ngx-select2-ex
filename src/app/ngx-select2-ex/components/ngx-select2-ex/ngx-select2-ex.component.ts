import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxSelect2ExOptionHandler } from '../../classes/ngx-select2-ex-option-handler';
import { NgxSelect2ExService } from '../../services/ngx-select2-ex.service';
import { Subscription } from 'rxjs/Subscription';

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

  @Input() options: Array<NgxSelect2ExOptionHandler>;
  @Input() disabled: boolean;
  @Input() theme: string;
  @Input() minimumResultsForSearch: number;
  @Input() allowClear = false;
  @Input() placeholder: string;

  isOpen: boolean;
  isInFocus: boolean;
  selection: Array<NgxSelect2ExOptionHandler> = [];

  private subscriptions: Array<Subscription> = [];
  private propagateChange = (_: any) => { };

  constructor(public ngxSelect2ExService: NgxSelect2ExService) { }

  ngOnInit() {
    this.subscribeToSelection();
    this.subscribeToIsOpen();
    this.subscribeToIsInFocus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue.length &&
      changes['options'].previousValue !== changes['options'].currentValue) {
      this.ngxSelect2ExService.options = changes['options'].currentValue;
    }
    if (changes['disabled'] !== undefined &&
      changes['disabled'].previousValue !== changes['disabled'].currentValue) {
      this.ngxSelect2ExService.disabled = changes['disabled'].currentValue;
    }

    this.defaultChangeListener(changes, 'theme');
    this.defaultChangeListener(changes, 'minimumResultsForSearch');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  writeValue(value: Array<NgxSelect2ExOptionHandler>) {
    this.ngxSelect2ExService.options = value;
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

  clearSelection() {
    if (this.shouldShowClearSelectionButton() && this.placeholder) {
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

  private defaultChangeListener(changes: SimpleChanges, fieldName: string) {
    if (changes[fieldName] && changes[fieldName].previousValue !== changes[fieldName].currentValue) {
      this.ngxSelect2ExService[fieldName] = changes[fieldName].currentValue;
    }
  }

}
