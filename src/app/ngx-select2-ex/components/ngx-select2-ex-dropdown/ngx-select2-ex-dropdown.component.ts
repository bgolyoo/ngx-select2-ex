import { Component, OnInit, HostBinding, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgxSelect2ExService } from '../../services/ngx-select2-ex.service';
import { NgxSelect2ExOptionHandler } from '../../classes/ngx-select2-ex-option-handler';

@Component({
  selector: 'app-ngx-select2-ex-dropdown',
  templateUrl: './ngx-select2-ex-dropdown.component.html',
  styleUrls: ['./ngx-select2-ex-dropdown.component.scss']
})
export class NgxSelect2ExDropdownComponent implements OnInit, OnDestroy {

  @Input() service: NgxSelect2ExService;
  @Input() theme: string;
  @Input() minimumResultsForSearch: number;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';
  @HostBinding('style.top') top;
  @HostBinding('style.left') left;
  @HostBinding('style.right') right;
  @HostBinding('style.width') width;

  options: Array<NgxSelect2ExOptionHandler> = [];

  private subscriptions: Array<Subscription> = [];

  constructor() { }

  ngOnInit() {
    this.subscribeToOptions();
    this.subscribeToBoundingClientRectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
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
  }

  getContainerThemeClass(): string {
    return 'select2-container--' + this.theme;
  }

  shouldHideSearchBox(): boolean {
    return this.options.length < this.minimumResultsForSearch;
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

  private initBoundingClientRectParams(boundingClientRect: ClientRect) {
    this.top = this.getBoundingClientRectParam(boundingClientRect, 'bottom');
    this.left = this.getBoundingClientRectParam(boundingClientRect, 'left');
    this.width = this.getBoundingClientRectParam(boundingClientRect, 'width');
  }

  private getBoundingClientRectParam(boundingClientRect, param: string): string {
    return boundingClientRect && boundingClientRect[param] ? boundingClientRect[param] + 'px' : '0px';
  }

}
