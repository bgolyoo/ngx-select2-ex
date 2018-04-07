import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSelect2ExDropdownComponent } from './ngx-select2-ex-dropdown.component';

describe('NgxSelect2ExDropdownComponent', () => {
  let component: NgxSelect2ExDropdownComponent;
  let fixture: ComponentFixture<NgxSelect2ExDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSelect2ExDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSelect2ExDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
