import { TestBed, inject } from '@angular/core/testing';

import { NgxSelect2ExService } from './ngx-select2-ex.service';

describe('NgxSelect2ExService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxSelect2ExService]
    });
  });

  it('should be created', inject([NgxSelect2ExService], (service: NgxSelect2ExService) => {
    expect(service).toBeTruthy();
  }));
});
