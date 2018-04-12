import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgxSelect2ExOptionHandler } from '../../classes/ngx-select2-ex-option-handler';
import { NgxSelect2ExService } from '../../services/ngx-select2-ex.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-ngx-select2-ex',
  templateUrl: './ngx-select2-ex.component.html',
  styleUrls: ['./ngx-select2-ex.component.scss']
})
export class NgxSelect2ExComponent implements OnInit, OnChanges, OnDestroy {

  @Input() options: Array<NgxSelect2ExOptionHandler>;
  @Input() theme: string;
  @Input() minimumResultsForSearch: number;

  isOpen: boolean;
  isInFocus: boolean;
  selection: Array<NgxSelect2ExOptionHandler> = [];

  private subscriptions: Array<Subscription> = [];

  constructor(private ngxSelect2ExService: NgxSelect2ExService) { }

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

    this.defaultChangeListener(changes, 'theme');
    this.defaultChangeListener(changes, 'minimumResultsForSearch');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  getContainerThemeClass(): string {
    return 'select2-container--' + this.ngxSelect2ExService.theme;
  }

  private subscribeToSelection(): void {
    this.subscriptions.push(this.ngxSelect2ExService.getSelectionAsObservable()
      .subscribe((selection: Array<NgxSelect2ExOptionHandler>) => this.selection = selection));
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
