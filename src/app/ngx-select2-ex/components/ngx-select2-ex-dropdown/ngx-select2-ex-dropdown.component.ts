import { Component, OnInit, HostBinding, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgxSelect2ExService } from '../../services/ngx-select2-ex.service';
import { NgxSelect2ExOptionHandler } from '../../classes/ngx-select2-ex-option-handler';
import { NgxSelect2ExLanguageInputs } from '../../classes/ngx-select2-ex-language-inputs';
import { NgxSelect2OptionFilterPipe } from '../../pipes/ngx-select2-option-filter.pipe';

@Component({
  selector: 'app-ngx-select2-ex-dropdown',
  templateUrl: './ngx-select2-ex-dropdown.component.html',
  styleUrls: ['./ngx-select2-ex-dropdown.component.scss']
})
export class NgxSelect2ExDropdownComponent implements OnInit, OnDestroy {

  @Input() service: NgxSelect2ExService;
  @Input() multi: boolean | null = null;
  @Input() theme: string;
  @Input() minimumResultsForSearch: number;
  @Input() minimumInputLength: number | null = null;
  @Input() maximumInputLength: number | null = null;
  @Input() language: NgxSelect2ExLanguageInputs;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';
  @HostBinding('style.top') top;
  @HostBinding('style.left') left;
  @HostBinding('style.right') right;
  @HostBinding('style.width') width;

  options: Array<NgxSelect2ExOptionHandler> = [];
  search: string;

  private subscriptions: Array<Subscription> = [];

  constructor(private filterPipe: NgxSelect2OptionFilterPipe) { }

  ngOnInit() {
    this.subscribeToOptions();
    this.subscribeToBoundingClientRectChanges();
    this.subscribeToSearchChanges();
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.selectOnClose();
  }

  onOptionHover(hoveredOption: NgxSelect2ExOptionHandler): void {
    if (!hoveredOption.disabled) {
      this.options.forEach((option: NgxSelect2ExOptionHandler) => {
        option.highlighted = option.id === hoveredOption.id;
      });
    }
  }

  onOptionClick(clickedOption: NgxSelect2ExOptionHandler): void {
    if (clickedOption.disabled) {
      return;
    }
    if (!clickedOption.selected) {
      this.service.select(clickedOption);
    } else {
      this.service.deselect(clickedOption);
    }
    this.service.search = null;
  }

  getContainerThemeClass(): string {
    return 'select2-container--' + this.theme;
  }

  shouldHideSearchBox(): boolean {
    return this.options.length < this.minimumResultsForSearch || this.multi;
  }

  getNoResultsMessage(): string {
    return this.language.noResults();
  }

  getInputTooShortMessage(): string {
    return this.language.inputTooShort(this.minimumInputLength);
  }

  getInputTooLongMessage(): string {
    return this.language.inputTooLong((this.search ? this.search.length : 0) - this.maximumInputLength);
  }

  shouldShowNoResultsMessage(): boolean {
    return this.search &&
      !this.filterPipe.filterOptions(this.options, this.search, this.minimumResultsForSearch).length &&
      !this.shouldShowInputTooShortMessage() &&
      !this.shouldShowInputTooLongMessage() &&
      (this.multi || !this.shouldHideSearchBox());
  }

  shouldShowInputTooShortMessage(): boolean {
    return this.minimumInputLength !== null &&
      (!this.search || this.search && this.search.length < this.minimumInputLength) &&
      !this.filterPipe.filterOptions(this.options, this.search, this.minimumResultsForSearch, this.minimumInputLength).length &&
      !this.shouldHideSearchBox();
  }

  shouldShowInputTooLongMessage(): boolean {
    return this.maximumInputLength !== null &&
      this.search && this.maximumInputLength < this.search.length &&
      !this.filterPipe.filterOptions(this.options, this.search, this.minimumResultsForSearch, null, this.maximumInputLength).length &&
      !this.shouldHideSearchBox();
  }

  private subscribeToOptions() {
    this.subscriptions.push(this.service.getOptionsAsObservable().subscribe(
      (options: Array<NgxSelect2ExOptionHandler>) => this.options = options,
      error => console.error(error)
    ));
  }

  private subscribeToBoundingClientRectChanges() {
    this.subscriptions.push(this.service.getBoundingClientRectAsObservable().subscribe(
      (boundingClientRect: ClientRect) => this.initBoundingClientRectParams(boundingClientRect)
    ));
  }

  private subscribeToSearchChanges() {
    this.subscriptions.push(this.service.getSearchAsObservable().subscribe(
      (search: string) => this.search = search
    ));
  }

  private initBoundingClientRectParams(boundingClientRect: ClientRect) {
    this.top = this.getBoundingClientRectParam(boundingClientRect, 'bottom');
    this.left = this.getBoundingClientRectParam(boundingClientRect, 'left');
    this.width = this.getBoundingClientRectParam(boundingClientRect, 'width');
  }

  private getBoundingClientRectParam(boundingClientRect, param: string): string {
    return boundingClientRect && boundingClientRect[param] ? boundingClientRect[param] + 'px' : '0px';
  }

  private selectOnClose() {
    const highlightedOption: NgxSelect2ExOptionHandler = this.options.find((option: NgxSelect2ExOptionHandler) => option.highlighted);
    if (highlightedOption && this.service.selectOnClose) {
      this.service.select(highlightedOption);
    }
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
