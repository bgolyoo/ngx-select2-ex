import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appNgxSelect2ExDropdownSearchField]'
})
export class NgxSelect2ExDropdownSearchFieldDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.setFocusForDropdownSearchField();
  }

  private setFocusForDropdownSearchField() {
    this.el.nativeElement.focus();
  }

}
