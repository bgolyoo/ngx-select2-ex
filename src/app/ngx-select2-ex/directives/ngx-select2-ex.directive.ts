import { Directive, ComponentRef, ElementRef, HostListener, Input, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { NgxSelect2ExDropdownComponent } from '../components/ngx-select2-ex-dropdown/ngx-select2-ex-dropdown.component';
import { NgxSelect2ExService } from '../services/ngx-select2-ex.service';
import { NgxSelect2ExDropdownInjectionService } from '../services/ngx-select2-ex-dropdown-injection.service';
import { INgxSelect2ExDropdownPosition } from '../interfaces/ngx-select2-ex-dropdown-position';
import { WindowRef } from '../services/window-ref.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[appNgxSelect2Ex]',
  providers: [WindowRef]
})
export class NgxSelect2ExDirective implements OnInit, OnDestroy {

  @Input() service: NgxSelect2ExService;

  private compRef: ComponentRef<NgxSelect2ExDropdownComponent>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngxSelect2ExDropdownInjectionService: NgxSelect2ExDropdownInjectionService,
    private winRef: WindowRef
  ) { }

  ngOnInit() {
    this.updateDropdownPosition();
    this.subscribeToSearchChanges();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  @HostListener('document:mouseup', ['$event.target'])
  onClick(targetElement) {
    const dropdown = this.compRef ? this.compRef.location.nativeElement : null;
    const clickedClearButton = targetElement.className === 'select2-selection__clear';
    const clickedDisabledOption = targetElement.hasAttribute('aria-disabled');
    const clickedNoOptionListItem = targetElement.className.includes('select2-results__message');
    const clickedSearchField = targetElement.className.includes('select2-search__field');
    const clickedRemoveChoice = targetElement.className.includes('select2-selection__choice__remove');
    const clickedDropdown = dropdown && dropdown.contains(targetElement);
    const clickedInside = this.el.nativeElement.contains(targetElement) || clickedDropdown;

    if (clickedInside && !this.service.isOpen) {
      this.service.isInFocus = false;
      if (!this.service.disabled) {
        this.openDropdown();
      }
    } else if (clickedInside && this.service.isOpen) {
      if (clickedDisabledOption || clickedNoOptionListItem || clickedSearchField || clickedClearButton) {
        this.service.isInFocus = false;
      } else {
        if (this.service.closeOnSelect || !clickedDropdown) {
          this.service.isInFocus = true;
          if (!clickedRemoveChoice) {
            this.closeDropdown();
          }
        }
      }
    } else if (!clickedInside && this.service.isOpen) {
      this.service.isInFocus = false;
      this.closeDropdown();
    } else if (!clickedInside && !this.service.isOpen) {
      this.service.isInFocus = false;
    }

    if (clickedInside) {
      this.setFocusForSearchField(this.compRef ? this.compRef.location.nativeElement : null);
      if (this.service.multi && !clickedNoOptionListItem) {
        this.service.search = null;
      }
    }
  }

  @HostListener('window:resize')
  resize() {
    this.updateDropdownPosition();
  }

  private openDropdown() {
    this.compRef = this.ngxSelect2ExDropdownInjectionService.appendComponent(NgxSelect2ExDropdownComponent, {
      service: this.service,
      multi: this.service.multi,
      theme: this.service.theme,
      minimumResultsForSearch: this.service.minimumResultsForSearch,
      minimumInputLength: this.service.minimumInputLength,
      maximumInputLength: this.service.maximumInputLength,
      language: this.service.language
    });
    this.service.isOpen = true;
    this.updateDropdownPosition();
  }

  private closeDropdown() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
    this.service.isOpen = false;
  }

  private setFocusForSearchField(targetElement: any) {
    const inlineSearchField = this.el.nativeElement ? this.el.nativeElement.getElementsByClassName('select2-search__field') : null;
    if (inlineSearchField && inlineSearchField.length) {
      inlineSearchField[0].focus();
    }
  }

  private subscribeToSearchChanges() {
    this.subscriptions.push(this.service.getSearchAsObservable().subscribe(
      (search) => {
        if (this.service.multi) {
          if (search && !this.service.isOpen) {
            if (!this.service.disabled) {
              this.openDropdown();
            }
          }
          this.updateDropdownPosition();
        }
      }
    ));
  }

  private updateDropdownPosition() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
    const offsetTop = boundingClientRect.bottom + this.winRef.nativeWindow.scrollY;
    const dropdownPosition: INgxSelect2ExDropdownPosition = {
      top: offsetTop,
      left: boundingClientRect.left,
      width: boundingClientRect.width
    };
    this.service.dropdownPosition = dropdownPosition;
    this.renderer.setStyle(this.el.nativeElement, 'width', `${boundingClientRect.width}px`);
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
