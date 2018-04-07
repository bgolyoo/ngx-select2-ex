import { Directive, ComponentRef, ElementRef, HostListener } from '@angular/core';
import { NgxSelect2ExDropdownComponent } from '../components/ngx-select2-ex-dropdown/ngx-select2-ex-dropdown.component';
import { NgxSelect2ExService } from '../services/ngx-select2-ex.service';
import { NgxSelect2ExDropdownInjectionService } from '../services/ngx-select2-ex-dropdown-injection.service';

@Directive({
  selector: '[appNgxSelect2Ex]'
})
export class NgxSelect2ExDirective {

  private compRef: ComponentRef<NgxSelect2ExDropdownComponent>;

  constructor(
    private el: ElementRef,
    private ngxSelect2ExService: NgxSelect2ExService,
    private ngxSelect2ExDropdownInjectionService: NgxSelect2ExDropdownInjectionService
  ) { }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
    const dropdown = this.compRef ? this.compRef.location.nativeElement : null;
    const clickedInside = this.el.nativeElement.contains(targetElement) || (dropdown && dropdown.contains(targetElement));

    if (clickedInside && !this.ngxSelect2ExService.isOpen) {
      this.ngxSelect2ExService.isInFocus = true;
      this.openDropdown();
    } else if (clickedInside && this.ngxSelect2ExService.isOpen) {
      this.ngxSelect2ExService.isInFocus = true;
      this.closeDropdown();
    } else if (!clickedInside && this.ngxSelect2ExService.isOpen) {
      this.ngxSelect2ExService.isInFocus = false;
      this.closeDropdown();
    } else if (!clickedInside && !this.ngxSelect2ExService.isOpen) {
      this.ngxSelect2ExService.isInFocus = false;
    }
  }

  @HostListener('window:resize')
  resize() {
    this.ngxSelect2ExService.boundingClientRect = this.el.nativeElement.getBoundingClientRect();
  }

  private openDropdown() {
    this.ngxSelect2ExService.boundingClientRect = this.el.nativeElement.getBoundingClientRect();
    this.compRef = this.ngxSelect2ExDropdownInjectionService.appendComponent(NgxSelect2ExDropdownComponent, {
      theme: this.ngxSelect2ExService.theme
    });
    this.setFocusForSearchField(this.compRef.location.nativeElement);
    this.ngxSelect2ExService.isOpen = true;
  }

  private closeDropdown() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
    this.ngxSelect2ExService.isOpen = false;
  }

  private setFocusForSearchField(targetElement: any) {
    const select2SearchField = targetElement ? targetElement.getElementsByClassName('select2-search__field') : null;
    if (select2SearchField && select2SearchField.length) {
      select2SearchField[0].focus();
    }
  }

}
