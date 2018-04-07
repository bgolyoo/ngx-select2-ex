import { TestBed, inject } from '@angular/core/testing';

import { NgxSelect2ExDropdownInjectionService } from './ngx-select2-ex-dropdown-injection.service';

describe('NgxSelect2ExDropdownInjectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxSelect2ExDropdownInjectionService]
    });
  });

  it('should be created', inject([NgxSelect2ExDropdownInjectionService], (service: NgxSelect2ExDropdownInjectionService) => {
    expect(service).toBeTruthy();
  }));
});
