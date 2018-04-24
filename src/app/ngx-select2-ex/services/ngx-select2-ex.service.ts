import { Injectable } from '@angular/core';
import { NgxSelect2ExOption } from '../classes/ngx-select2-ex-option';
import { NgxSelect2ExOptionHandler } from '../classes/ngx-select2-ex-option-handler';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { NgxSelect2ExLanguageInputs } from '../classes/ngx-select2-ex-language-inputs';

@Injectable()
export class NgxSelect2ExService {

  multi: boolean | null = null;
  disabled = false;
  theme = 'default';
  minimumResultsForSearch = 0;
  minimumInputLength: number | null = null;
  maximumInputLength: number | null = null;
  language: NgxSelect2ExLanguageInputs = new NgxSelect2ExLanguageInputs();
  selectOnClose: boolean | null = false;
  closeOnSelect: boolean | null = true;

  private _options: BehaviorSubject<Array<NgxSelect2ExOption>> = new BehaviorSubject([]);
  private _boundingClientRect: ReplaySubject<ClientRect> = new ReplaySubject(1);
  private _isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isInFocus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _selection: BehaviorSubject<Array<NgxSelect2ExOptionHandler>> = new BehaviorSubject([]);
  private _search: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() { }

  get options(): Array<NgxSelect2ExOptionHandler> {
    return this._options.getValue();
  }

  set options(options: Array<NgxSelect2ExOptionHandler>) {
    this._options.next(NgxSelect2ExOptionHandler.copyArray(options));
    this.selection = this.options;
  }

  getOptionsAsObservable(): Observable<Array<NgxSelect2ExOptionHandler>> {
    return this._options.asObservable();
  }

  set selection(options: Array<NgxSelect2ExOptionHandler>) {
    options = NgxSelect2ExOptionHandler.copyArray(options);
    let selection: Array<NgxSelect2ExOptionHandler> = options.filter((option: NgxSelect2ExOptionHandler) => option.selected);
    if (this.multi) {
      this._selection.next(selection);
    } else {
      let selectedOption;
      if (selection.length === 0 && options.length) {
        selectedOption = NgxSelect2ExOptionHandler.copyArray(options).reverse().pop();
      } else if (selection.length > 0) {
        selectedOption = selection.pop();
      }
      options.forEach(o => o.selected = false);
      options[options.findIndex(o => o.id === selectedOption.id)].selected = true;
      this._options.next(options);
      selection = [selectedOption];
      this._selection.next(selection);
    }
  }

  get selection(): Array<NgxSelect2ExOptionHandler> {
    return this._selection.getValue();
  }

  getSelectionAsObservable(): Observable<Array<NgxSelect2ExOptionHandler>> {
    return this._selection.asObservable();
  }

  set boundingClientRect(boundingClientRect: ClientRect) {
    this._boundingClientRect.next(boundingClientRect);
  }

  getBoundingClientRectAsObservable(): Observable<ClientRect> {
    return this._boundingClientRect.asObservable();
  }

  set isOpen(isOpen: boolean) {
    this._isOpen.next(isOpen);
  }

  get isOpen(): boolean {
    return this._isOpen.getValue();
  }

  getIsOpenAsObservable(): Observable<boolean> {
    return this._isOpen.asObservable();
  }

  set isInFocus(isInFocus: boolean) {
    this._isInFocus.next(isInFocus);
  }

  get isInFocus(): boolean {
    return this._isInFocus.getValue();
  }

  getIsInFocusAsObservable(): Observable<boolean> {
    return this._isInFocus.asObservable();
  }

  set search(search: string) {
    this._search.next(search);
  }

  get search(): string {
    return this._search.getValue();
  }

  getSearchAsObservable(): Observable<string> {
    return this._search.asObservable();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  select(optionHandlerToSelect: NgxSelect2ExOptionHandler) {
    if (!this.multi) {
      this.options.forEach((option: NgxSelect2ExOptionHandler) => option.selected = false);
    }
    const indexOfSelected = this.options.findIndex((option: NgxSelect2ExOptionHandler) => option.id === optionHandlerToSelect.id);
    if (indexOfSelected > -1) {
      const options = NgxSelect2ExOptionHandler.copyArray(this.options);
      options[indexOfSelected].selected = true;
      this.options = options;
    }
  }

  deselect(optionHandlerToDeselect: NgxSelect2ExOptionHandler) {
    if (!this.multi) {
      return;
    } else {
      const indexOfDeselected = this.options.findIndex((option: NgxSelect2ExOptionHandler) => option.id === optionHandlerToDeselect.id);
      if (indexOfDeselected > -1) {
        const options = NgxSelect2ExOptionHandler.copyArray(this.options);
        options[indexOfDeselected].selected = false;
        this.options = options;
      }
    }
  }

  clear() {
    const options = NgxSelect2ExOptionHandler.copyArray(this.options);
    options.forEach((option: NgxSelect2ExOptionHandler) => option.selected = false);
    this._options.next(options);
    this._selection.next([]);
  }

}
