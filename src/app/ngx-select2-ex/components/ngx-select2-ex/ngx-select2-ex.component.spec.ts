import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSelect2ExComponent } from './ngx-select2-ex.component';

describe('NgxSelect2ExComponent', () => {
  let component: NgxSelect2ExComponent;
  let fixture: ComponentFixture<NgxSelect2ExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSelect2ExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSelect2ExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
