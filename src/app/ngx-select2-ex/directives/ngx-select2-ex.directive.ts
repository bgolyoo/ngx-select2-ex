import { Directive, ComponentRef, ElementRef, HostListener, Input } from '@angular/core';
import { NgxSelect2ExDropdownComponent } from '../components/ngx-select2-ex-dropdown/ngx-select2-ex-dropdown.component';
import { NgxSelect2ExService } from '../services/ngx-select2-ex.service';
import { NgxSelect2ExDropdownInjectionService } from '../services/ngx-select2-ex-dropdown-injection.service';

@Directive({
  selector: '[appNgxSelect2Ex]'
})
export class NgxSelect2ExDirective {

  @Input() service: NgxSelect2ExService;

  private compRef: ComponentRef<NgxSelect2ExDropdownComponent>;

  constructor(
    private el: ElementRef,
    private ngxSelect2ExDropdownInjectionService: NgxSelect2ExDropdownInjectionService
  ) { }

  @HostListener('document:mouseup', ['$event.target'])
  onClick(targetElement) {
    const dropdown = this.compRef ? this.compRef.location.nativeElement : null;
    const clickedClearButton = targetElement.className === 'select2-selection__clear';
    const clickedDisabledOption = targetElement.hasAttribute('aria-disabled');
    const clickedNoOptionListItem = targetElement.className.includes('select2-results__message');
    const clickedSearchField = targetElement.className.includes('select2-search__field');
    const clickedInside = !clickedClearButton &&
      this.el.nativeElement.contains(targetElement) || (dropdown && dropdown.contains(targetElement));

    if (clickedInside && !this.service.isOpen) {
      this.service.isInFocus = false;
      if (!this.service.disabled) {
        this.openDropdown();
      }
    } else if (clickedInside && this.service.isOpen) {
      if (clickedDisabledOption || clickedNoOptionListItem || clickedSearchField) {
        this.service.isInFocus = false;
      } else {
        this.service.isInFocus = true;
        this.closeDropdown();
      }
    } else if (!clickedInside && this.service.isOpen) {
      this.service.isInFocus = false;
      this.closeDropdown();
    } else if (!clickedInside && !this.service.isOpen) {
      this.service.isInFocus = false;
    }
  }

  @HostListener('window:resize')
  resize() {
    this.service.boundingClientRect = this.el.nativeElement.getBoundingClientRect();
  }

  private openDropdown() {
    this.service.boundingClientRect = this.el.nativeElement.getBoundingClientRect();
    this.compRef = this.ngxSelect2ExDropdownInjectionService.appendComponent(NgxSelect2ExDropdownComponent, {
      service: this.service,
      theme: this.service.theme,
      minimumResultsForSearch: this.service.minimumResultsForSearch,
      minimumInputLength: this.service.minimumInputLength,
      maximumInputLength: this.service.maximumInputLength,
      language: this.service.language
    });
    this.setFocusForSearchField(this.compRef.location.nativeElement);
    this.service.isOpen = true;
  }

  private closeDropdown() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
    this.service.isOpen = false;
  }

  private setFocusForSearchField(targetElement: any) {
    const select2SearchField = targetElement ? targetElement.getElementsByClassName('select2-search__field') : null;
    if (select2SearchField && select2SearchField.length) {
      select2SearchField[0].focus();
    }
  }

}
